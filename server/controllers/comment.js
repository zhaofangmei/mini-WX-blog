const { mysql } =  require('../qcloud.js')

async function getDataByPostId(ctx, next) {
  let postid = ctx.query.postid;
  await mysql('blog_comment').select('*').where('postid', postid).orderBy('ctime', 'desc').then(res => {
    console.log('>>>>>>>>>>getDataByPostId res', res)
    let allDatas = res || []
    let firstTmp = allDatas.filter(item => {
      return item.parentid == ""
    })

    // for (var i = 0; i < firstTmp.length; i++) {
    //   let item = firstTmp[i]
    //   item.childList = []
    //   for (var j = 0; j < allDatas.length; j++) {
    //     let data = allDatas[j]
    //     if (item.id + '' == data.parentid) {
    //       item.childList.push(data)
    //     }
    //   }
    // }

    filter(firstTmp, allDatas)

    function filter(tmp, all) {
      for (var i = 0; i < tmp.length; i++) {
        let item = tmp[i]
        item.childList = []
        for (var j = 0; j < all.length; j++) {
          let data = all[j]
          if (item.id + '' == data.parentid) {
            item.childList.push(data)
            filter(item.childList, all)
          }
        }
      }
    }
    
    console.log('>>>>>>>>>>>>>firstTmp: ', firstTmp)
    ctx.state.code = 0
    ctx.state.data = firstTmp
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