// pages/me/me.js
//获取应用实例
const app = getApp()

Page({
  // 页面的初始数据
  data: {
    userInfo: {}
  },
  //  生命周期函数--监听页面加载
  onLoad: function(options) {
    const that = this;
    app.checkUserInfo(function(userInfo, isLogin) {
      if (!isLogin) {
        wx.redirectTo({
          url: '../authorization/authorization?backType=me',
        })
      } else {
        that.setData({
          userInfo: userInfo
        });
      }

    });

  },

})