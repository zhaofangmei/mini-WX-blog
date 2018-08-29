// pages/article/article.js
const app = getApp()
const config = require('../../config')
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    article: ''
  },

  goBack: function() {
    wx.switchTab({
      url: '../home/home',
    })
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
    console.log(app.globalData)
    console.log(this.data.article)
    // wx.request({
    //   url: `${config.service.host}/weapp//article/delete`,
    //   data: { id: id },
    //   method: 'GET',
    //   header: {
    //     'Context-Type': 'application/json'
    //   },
    //   success: function (res) {
    //     if (res.data.code == 0) {
    //       debugger
    //       util.showSuccess('操作成功');
    //       wx.switchTab({
    //         url: '../home/home',
    //       })
    //     } else {
    //       util.showModel('请求失败', res.data.error);
    //       return false;
    //     }
    //   },
    //   fail: function (err) {
    //     util.showModel('请求失败', error);
    //     console.log('request fail', error);
    //     return false;
    //   }

    // })
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
    let that = this
    let articleId = options.articleId || ''
    app.checkUserInfo(function (userInfo, isLogin) {
      if (!isLogin) {
        wx.redirectTo({
          url: '../authorization/authorization?backType=' + articleId,
        })
      } else {
        that.getData(articleId)        
      }
    });
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