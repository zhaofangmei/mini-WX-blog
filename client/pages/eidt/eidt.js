// pages/eidt/eidt.js
const app = getApp()
const config = require('../../config')
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['常用', '爱好', '随笔'],
    article: {
      title: '',
      pickIndex: 0,
      tag: '',
      post:''
    }
  },

  getData: function (id) {
    let that = this
    wx.request({
      url: `${config.service.host}/weapp/article`,
      data: {
        id: id
      },
      method: 'GET',
      header: {
        'Context-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 0) {
          let data = res.data.data;
          for (var item of data) {
            item.ctime = util.formatTime(item.ctime)
          }
          if (data.length <= 0) return
          let tmp = data[0]
          let tag = tmp.tag
          let pickIndex = 0
          that.data.array.forEach((item,index) => {
            if(item == tag) {
              pickIndex = index
            }

          })

          that.setData({
            article: {
              title: tmp.title,
              pickIndex: pickIndex || 0,
              tag: tmp.tag,
              post: tmp.post,
            }
          })

          console.log('>>>>>>>>', that.data.article)

        } else {
          util.showModel('请求失败', res.data.error);
          return false;
        }
      },
      fail: function (err) {
        util.showModel('请求失败', error);
        return false;
      }

    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let articleId = options.articleId || ''
    this.getData(articleId)
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
  onShareAppMessage: function () {
  
  }
})