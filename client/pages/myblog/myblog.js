// pages/myblog/myblog.js
const app = getApp()
const config = require('../../config')
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogs: [],
    currentType: '常用',
    tags: ['常用', '爱好', '随笔']
  },
  orderBy: function(e) {
    let item = e.target.dataset.item;
    this.setData({
      currentType: item
    })
    this.getBlogList()
  },
  getBlogList: function() {
    let tag = this.data.currentType
    let openid = app.globalData.openid
    let params = {
      tag: tag,
      openid: openid
    }
    let options = {
      url: `${config.service.host}/weapp/post/myblog`,
      method: 'GET',
      data: params,
      header: {
        'content-type': 'application/json'
      },
      tip: true
    }
    util.request(options).then((res) => {
      if (res.data.code == 0) {
        let blogs = res.data.data;
        blogs.forEach(item => {
          item.ctime = util.formatTime(item.ctime)
        })
        this.setData({
          blogs: blogs
        })
      } else {
        util.showModel('请求失败', res.data.error);
        return false;
      }
    }).catch((error) => {
      util.showModel('请求失败', error);
      console.log('request fail', error);
      return false;
    })
  },
  onLoad: function (options) {
    this.getBlogList()
  }
})