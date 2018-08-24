// pages/home/home.js
const config = require('../../config')
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    complete: true,
    more: true,
    pageIndex: 1,
    pageSize: 5,
    postList: []
  },

  goDeatil: function(e) {
    let articleId = e.currentTarget.id;
    wx.navigateTo({
      url: '../article/article?articleId=' + articleId,
    })
  },

  getList: function() {
    let that = this;
    let pageIndex = that.data.pageIndex;
    let pageSize = that.data.pageSize;
    wx.request({
      url: `${config.service.host}/weapp/home`,
      data: {
        user: null,
        pageSize: pageSize,
        pageIndex: pageIndex
      },
      header: {
        'Content-Type': 'application/json'
      },
      method: 'GET',
      success: function(res) {
        if (res.data.code == 0) {
          // debugger
          let pots = res.data.data;
          
          pots.forEach(item => {
            item.ctime = util.formatTime(item.ctime)
          })
          that.setData({
            postList: that.data.postList.concat(pots),
          })
          if (pots.length <= 0) {
            that.setData({
              more: false
            })
          }
          that.data.pageIndex++
        } else {
          util.showModel('请求失败', res.data.error);
          return false;
        }
      },
      fail: function(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
        return false;
      }
    })
  },

  bindDownLoad: function() {
    var that = this
    if (!that.data.complete) {
      return;
    }
    if(that.data.more) {
      that.setData({
        complete: false
      })
      util.showBusy('加载中', 400) 
      that.getList()
      that.setData({
        complete: true
      })
    }
  },

  onLoad: function(options) {
    var that = this
    util.showBusy('加载中', 400) 
    //获取scrollHeight数值,微信必须要设置style:height才能监听滚动事件
    wx.getSystemInfo({
      success: function(res) {
        // console.info(res.windowHeight)
        that.setData({
          scrollHeight: res.windowHeight
        })
      }
    })
    that.getList()
  }
})