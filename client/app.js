//app.js
const qcloud = require('./vendor/wafer2-client-sdk/index')
const config = require('./config')

App({
  onLaunch: function (obj) {
    qcloud.setLoginUrl(config.service.loginUrl)
  },
  checkUserInfo: function(cb) {
    const that = this
    let session = qcloud.Session.get()
    that.globalData.userInfo = session ? session.userinfo : null
    if (!that.globalData.userInfo) {
      console.log('not login .............')
      that.globalData.logined = false
      typeof cb == "function" && cb(that.globalData.userInfo, false);
    } else {
      console.log('logined .............')
      that.globalData.openid = that.globalData.userInfo.openId
      that.globalData.logined = true
      typeof cb == "function" && cb(that.globalData.userInfo, true);
    }
  },
  appShareHandle(e) {
    return {
      title: '阿梅博客，闲聊时光',
      path: '/pages/home/home',
      imageUrl: '',
      success: function (res) {
        // 转发成功
        console.log('>>>>>>>>转发成功:', res)
        if (res.errMsg === 'shareAppMessage:ok') {
          if (res.hasOwnProperty('shareTickets')) {
            // 分享到群
          } else {
            // 分享到个人
          }
        }
      },
      fail: function (obj) {
        // 转发失败
        console.log('>>>> share fail..')
      }
    }
  },
  globalData: {
    session_key: '',
    openid: null,
    logined: true,
    userInfo: null
  }
})