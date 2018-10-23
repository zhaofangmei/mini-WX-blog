// pages/eidt/eidt.js
const app = getApp()
const config = require('../../config')
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    array: ['常用', '爱好', '随笔'],
    originArticle: '',
    article: {
      title: '',
      pickIndex: 0,
      tag: '',
      post: ''
    },
    articleId: ''
  },

  bindPickerChange: function(e) {
    let pickIndex = e.detail.value;
    let tag = this.data.array[pickIndex];
    let article = this.data.article
    this.setData({
      article: {
        title: article.title,
        pickIndex: pickIndex,
        tag: tag,
        post: article.post
      }
    })

  },

  bindTextAreaBlur: function(e) {
    let article = this.data.article
    let post = e.detail.value
    this.setData({
      article: {
        title: article.title,
        pickIndex: article.pickIndex,
        tag: article.tag,
        post: post
      }
    })
  },
  //表单数据是否改变
  isDirty: function(originData, newData) {
    let dirty = false;
    let keys = Object.keys(originData);
    if (keys.length == 0) return true;
    for (let item in newData) {
      if (item == 'id') continue
      if (newData[item] != originData[item]) {
        dirty = true
      }
    }
    return dirty;
  },

  formSumbit: function(e) {
    this.data.loading = true
    let article = this.data.article
    let origin = this.data.originArticle
    let isDirty = this.isDirty(origin, article)
    if (!isDirty) {
      util.showModel('提示', '数据项未改变！');
      return false;
    }

    let tag = e.detail.value.tag || ''
    let post = this.data.article.post || ''
    let id = this.data.articleId
    if (!post) {
      util.showModel('提示', '正文不可为空！');
      return false;
    }

    let params = {
      id: id,
      tag: tag,
      post: post
    }

    var that = this
    wx.request({
      url: `${config.service.host}/weapp/edit`,
      method: 'POST',
      data: params,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        that.data.loading = false
        if (res.data.code === 0) {
          util.showSuccess('操作成功！')
          wx.switchTab({
            url: '../home/home',
          })

        } else {
          util.showModel('请求失败', res.data.error);
          return false;
        }
      },
      fail: function(error) {
        that.data.loading = false
        util.showModel('请求失败', error);
        return false;
      }
    })

  },

  getData: function(id) {
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
      success: function(res) {
        if (res.data.code == 0) {
          let data = res.data.data;
          for (var item of data) {
            item.ctime = util.formatTime(item.ctime)
          }
          if (data.length <= 0) return
          let tmp = data[0]
          let tag = tmp.tag
          let pickIndex = 0
          that.data.array.forEach((item, index) => {
            if (item == tag) {
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

          that.setData({
            originArticle: util.deepClone(that.data.article)
          })

        } else {
          util.showModel('请求失败', res.data.error);
          return false;
        }
      },
      fail: function(err) {
        util.showModel('请求失败', error);
        return false;
      }

    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let articleId = options.articleId || ''
    this.setData({
      articleId: articleId
    })
    this.getData(articleId)
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
  onShareAppMessage: function (e) {
    return app.appShareHandle()
  }
})