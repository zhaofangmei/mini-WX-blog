const { mysql } =  require('../qcloud.js')

async function getDataByPostId(ctx, next) {
  let postid = ctx.query.postid;
  await mysql('blog_comment').select('*').where('postid', postid).orderBy('ctime', 'desc').then(res => {
    console.log('>>>>>>>>>>getDataByPostId res', res)
    let all_Tmp = res
    ctx.state.code = 0
    ctx.state.data = res
  }).catch(err => {
    ctx.state.code = -1
    throw new Error(err)
  })
}

async function save(ctx, next) {
  console.log('>>>>>>>>>>>>>>>ctx.request:', ctx.request.body)
  let query = ctx.request.body || {};
  query.ctime = new Date().getTime();
  if (query.openid && query.postid && query.comment) {
    await mysql('blog_comment').insert([query]).then(res => {
      ctx.state.code = 0
      ctx.state.data = res
    }).catch(err => {
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
  getDataByPostId
}