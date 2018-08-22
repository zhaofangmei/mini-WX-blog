// pages/home/home.js
const config = require('../../config')
const util = require('../../utils/util.js')

var pageIndex = 1;
var GetList = function(that) {
  wx.request({
    url: `${config.service.host}/weapp/home`,
    data: {
      name: null,
      pageSize: 5,
      pageIndex: pageIndex
    },
    header: {
      'Content-Type': 'application/json'
    },
    method: 'GET',
    success: function(res) {
      if(res.data.code == 0) {
        that.setData({
          homeList: res.data.data
        })
        pageIndex++;
      } else {
        util.showModel('请求失败', res.data.error);
        return false;
      }
    },
    fail: function (error) {
      util.showModel('请求失败', error);
      console.log('request fail', error);
      return false;
    }
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    homeList: []
  },

  bindDownLoad: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 400
    })
    var that = this;
    GetList(that);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    //缓冲提醒
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 400
    })
    //获取系统的参数，scrollHeight数值,微信必须要设置style:height才能监听滚动事件
    wx.getSystemInfo({
      success: function(res) {
        console.info(res.windowHeight)
        that.setData({
          scrollHeight: res.windowHeight
        })
      }
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    GetList(that);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})