// pages/authorization/authorization.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const util = require('../../utils/util.js')
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    backType: 'home'
  },
  bindGetUserInfo: function(e) {
    const self = this
    util.loading()
    let backType = self.data.backType;
    if (e.detail.userInfo) { //已授权
      // app.globalData.userInfo = e.detail.userInfo;
      qcloud.setLoginUrl(config.service.loginUrl)
      qcloud.login({
        success: function (userInfo) {
          console.log(userInfo)
          app.globalData.userInfo = userInfo
          app.globalData.openid = userInfo.openId
          if (backType == 'home') {
            wx.switchTab({
              url: '../home/home',
            })
          } else if (backType == 'me') {
            wx.switchTab({
              url: '../me/me',
            })
          } else if (backType == 'post') {
            wx.switchTab({
              url: '../post/post',
            })
          } else {
            wx.redirectTo({
              url: '../article/article?articleId=' + backType
            })
          }
        },
        fail: function (err) {
          util.loaded()
          console.log('登录失败', err)
        },
        complete: function (res) {
          util.loaded()
        }
      })
      
    }
  },
  navigateBack: function() {
    wx.switchTab({
      url: '../home/home',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      backType: options.backType
    });
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    return app.appShareHandle()
  }
})