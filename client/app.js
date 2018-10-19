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
  globalData: {
    session_key: '',
    openid: null,
    logined: true,
    userInfo: null
  }
})