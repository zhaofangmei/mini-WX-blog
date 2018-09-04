//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
  onLaunch: function() {
    let that = this
    wx.login({
      success: function(res) {
        if (res.code) {
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session',
            method: 'GET',
            data: {
              appid: config.appid,
              secret: config.secret,
              js_code: res.code,
              grant_type: 'authorization_code'
            },
            success: function(res) {
              console.log('>>>>>>>>：', JSON.stringify(res.data))
              if (res.data) {
                let session_key = res.data.session_key || ''
                let openid = res.data.openid || ''
                that.globalData.session_key = session_key
                that.globalData.openid = openid                
              }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },

  // onLaunch: function () {
  //     qcloud.setLoginUrl(config.service.loginUrl)
  // },
  checkUserInfo: function(cb) {
    let that = this
    if (that.globalData.userInfo) {
      typeof cb == "function" && cb(that.globalData.userInfo, true);
    }
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              that.globalData.userInfo = JSON.parse(res.rawData);
              typeof cb == "function" && cb(that.globalData.userInfo, true);
            }
          })
        } else {
          typeof cb == "function" && cb(that.globalData.userInfo, false);
        }
      }
    })
  },
  globalData: {
    session_key: '',
    openid: '',
    userInfo: null
  }
})