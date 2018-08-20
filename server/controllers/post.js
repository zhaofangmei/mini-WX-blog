const { mysql } = require('../qcloud')

/**
 * 响应 GET 请求（响应微信配置时的签名检查请求）
 */
async function get(ctx, next) {
  console.log('>>>>>>>>>>>>>>>ctx.query:', ctx.req)
}

async function post(ctx, next) {
  console.log('>>>>>>>>>>>>>>>ctx.request:', ctx.request.body)
  let query = ctx.request.body || {};
  query.ctime = new Date().getTime();
  // let query = { user: '11name', title: '111title', post: '1111post' }
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
  post,
  get
}
