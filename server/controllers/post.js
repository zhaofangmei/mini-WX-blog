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

async function getPage(ctx, next) {
  console.log('>>>>>>>>>>>>>>>ctx.query:', ctx.query)
  let params = ctx.query
  let { limit, offset} = _4page(params)
  // select('*').from('users').limit(10).offset(30).where('id', 1)
  await mysql('t_blog_post').select('*').limit(limit).offset(offset).then(res => {
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
  if (query.user && query.title && query.tag && query.post) {
    await mysql('t_blog_post').insert([query]).then(res => {
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
  getPage
}
