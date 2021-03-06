const { mysql } = require('../qcloud')

function _4page(params) {
  let pageSize = params.pageSize && parseInt(params.pageSize) || 20;
  pageSize = pageSize > 0 && pageSize < 100 && pageSize || 20;

  let pageIndex = params.pageIndex && parseInt(params.pageIndex) || 1;
  pageIndex = pageIndex > 0 && pageIndex || 1; 

  let limit = pageSize;
  let offset = (pageIndex - 1) * pageSize;
  delete params.pageIndex;
  delete params.pageSize;
  return { limit: limit, offset: offset }
}

async function getBlogByTag(ctx, next) {
  console.log(new Date() + '>>>>>>>>>>>>>>>getBlogByTag ctx.query:', ctx.query)
  let openid = ctx.query.openid
  let tag = ctx.query.tag
  await mysql('blog_post').select('*').where({ 'server_status': 1, openid: openid, tag: tag}).orderBy('ctime', 'desc').then(res => {
    console.log('>>>>>>>>>>getBlogByTag res', res)
    ctx.state.code = 0
    ctx.state.data = res
  }).catch(err => {
    ctx.state.code = -1
    throw new Error(err)
  })

}

async function deleteById(ctx, next) {
  let id = ctx.query.id;
  await mysql('blog_post').update({server_status: 0}).where('id', id).then(res => {
    console.log('>>>>>>>>>>getBlogById res', res)
    ctx.state.code = 0
    ctx.state.data = res
  }).catch(err => {
    ctx.state.code = -1
    throw new Error(err)
  })

}

async function getBlogById(ctx, next) {
  try {
    console.log('getBlogById>>>>>>>>>>>>>>>>>', ctx)
    let id = ctx.query.id;
    let isReload = ctx.query.isReload;
    if (isReload == 0) {
      await mysql('blog_post').increment('pv', 1).where('id', id)
    }
    await mysql('blog_post').select('*').where('id', id).then(res => {
      console.log('>>>>>>>>>>getBlogById res',res)
      ctx.state.code = 0
      ctx.state.data = res
    }).catch(err => {
      console.log('err>>>>>>>>>>>>', err)
      ctx.state.code = -1
      throw new Error(err)
    })
  } catch (err) {
    console.log('err>>>>>>>>>>>>', err)
    ctx.state.code = -1
    throw new Error(err)
  }

}

async function getBlogList(ctx, next) {
  try {
    console.log(new Date() + '>>>>>>>>>>>>>>>getBlogList ctx.query:', ctx.query)
    let params = ctx.query
    let { limit, offset } = _4page(params)
    // select('*').from('users').limit(10).offset(30).where('id', 1)
    let postList = await mysql('blog_post').select('*').limit(limit).offset(offset).where('server_status', 1).orderBy('ctime', 'desc')
    for(var i = 0; i < postList.length; i++) {
      let item = postList[i]
      let postid = item.id
      let list = await mysql('blog_comment').select('*').where('postid', postid)
      item.commentCount = list.length 
    }
    ctx.state.code = 0
    ctx.state.data = postList
  } catch (err) {
    console.log('err>>>>>>>>>>>>', err)
    ctx.state.code = -1
    throw new Error(err)
  }
}

async function updateBlogById(ctx, next) {
  console.log('>>>>>>>>>>>>>>>ctx.request:', ctx.request.body)
  let query = ctx.request.body || {}
  let ctime = new Date().getTime()
  if(query.id) {
    let id = query.id
    let params = {
      tag: query.tag,
      post: query.post,
      imgpath: query.imgpath,
      ctime: ctime
    }
    await mysql('blog_post').update(params).where('id', id).then(res => {
      console.log('>>>>>>>>>>updateBlogById res', res)
      ctx.state.code = 0
      ctx.state.data = res
    }).catch(err => {
      console.log('err>>>>>>>>>>>>', err)
      ctx.state.code = -1
      throw new Error(err)
    })

  } else {
    ctx.state.code = -1
    throw new Error('参数异常！')
  }

}

async function save(ctx, next) {
  console.log('>>>>>>>>>>>>>>>ctx.request:', ctx.request.body)
  let query = ctx.request.body || {};
  query.ctime = new Date().getTime();
  if (query.user && query.title && query.tag && query.post) {
    await mysql('blog_post').insert([query]).then(res => {
      ctx.state.code = 0
      ctx.state.data = res
    }).catch(err => {
      console.log('err>>>>>>>>>>>>', err)
      ctx.state.code = -1
      throw new Error(err)
    })

  } else {
    ctx.state.code = -1
    throw new Error('参数异常！')
  }


}

module.exports = {
  save,
  getBlogList,
  getBlogById,
  deleteById,
  updateBlogById,
  getBlogByTag
}
