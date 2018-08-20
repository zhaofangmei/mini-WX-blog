const { mysql } = require('../qcloud')
/**
 * knex('coords').insert([{x: 20}, {y: 30}, {x: 10, y: 20}])
// insert into `coords` (`x`, `y`) values (20, NULL), (NULL, 30), (10, 20)"
*/ 

module.exports = async (ctx, next) => {
  await mysql('t_blog_post').insert([{user_name:'11name',title: '111title',post: '1111post'}]).then(res => {
    ctx.state.code = 0
    ctx.state.data = res
  }).catch(err => {
    ctx.state.code = -1
    throw new Error(err)
  })
  // await mysql('cSessionInfo').select('*').then(res => {
  //   ctx.state.code = 0
  //   ctx.state.data = res
  // }).catch(err => {
  //   ctx.state.code = -1
  //   throw new Error(err)
  // })
}

// module.exports = async ctx => {
//   const data = {msg: 'Hello World'}

//   ctx.state.data = data
// }
