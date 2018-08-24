// pages/article/article.js
const config = require('../../config')
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    article: ''
  
  },

  editHandler: function(e) {
    let articleId = e.currentTarget.id;
    wx.navigateTo({
      url: '../eidt/eidt?articleId=' + articleId,
    })
  },

  reprintHandler: function() {
    wx.showModal({
      title: '转载',
      content: '是否转载该文章？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')

        
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  delRequest: function (id) {
    wx.request({
      url: `${config.service.host}/weapp//article/delete`,
      data: { id: id },
      method: 'GET',
      header: {
        'Context-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 0) {
          debugger
          util.showSuccess('操作成功');
          wx.switchTab({
            url: '../home/home',
          })
        } else {
          util.showModel('请求失败', res.data.error);
          return false;
        }
      },
      fail: function (err) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
        return false;
      }

    })
  },

  delHandler: function(e) {
    let that = this
    wx.showModal({
      title: '删除',
      content: '是否删除该文章？',
      success: function (res) {
        if (res.confirm) {
          let articleId = e.currentTarget.id;
          that.delRequest(articleId);

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  getData: function(id) {
    let that = this
    wx.request({
      url: `${config.service.host}/weapp/article`,
      data: {id: id},
      method: 'GET',
      header: {
        'Context-Type': 'application/json'
      },
      success: function(res) {
        if (res.data.code == 0) {
          let data = res.data.data;
          for(var item of data) {
            item.ctime = util.formatTime(item.ctime)
          }
          that.setData({
            article: data[0] || ''
          });
        } else {
          util.showModel('请求失败', res.data.error);
          return false;
        }
      },
      fail: function(err) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
        return false;
      }

    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let articleId = options.articleId || ''
    let that = this
    that.getData(articleId)
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
    return {
      title: this.data.article.title,
      path: '/pages/detail/detail?articleId=' + this.data.article.id
    }
  }
})