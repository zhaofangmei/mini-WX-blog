// pages/home/home.js
const app = getApp()
const config = require('../../config')
const util = require('../../utils/util.js')

Page({
  data: {
    complete: true,
    more: true,
    pageIndex: 1,
    pageSize: 10,
    postList: []
  },

  goDeatil: function(e) {
    let that = this;
    let articleId = e.currentTarget.id;
    wx.navigateTo({
      url: '../article/article?articleId=' + articleId,
    })

  },

  getList: function() {
    let that = this;
    let pageIndex = that.data.pageIndex;
    let pageSize = that.data.pageSize;
    let options = {
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
      tip: true
    }
    util.request(options).then((res) => {
      if (res.data.code == 0) {
        let pots = res.data.data;
        if (Array.isArray(pots)) {
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
        }
      } else {
        util.showModel('请求失败', res.data.error);
        return false;
      }
    }, (err) => {
      util.showModel('请求失败', err);
      console.log('request fail', err);
      return false;
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
      that.getList()
      that.setData({
        complete: true
      })
    }
  },

  onShow: function() {
    // console.log('home onShow....', app.globalData.userInfo)
    var that = this
    //获取scrollHeight数值,微信必须要设置style:height才能监听滚动事件
    wx.getSystemInfo({
      success: function (res) {
        // console.info(res.windowHeight)
        that.setData({
          scrollHeight: res.windowHeight
        })
      }
    })
    that.setData({
      pageIndex: 1,
      postList: []
    })
    that.getList()
  }
})