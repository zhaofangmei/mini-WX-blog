// pages/post/post.js
const app = getApp()
const config = require('../../config')
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    tag: '',
    title: '',
    pickIndex: 0,
    array: ['常用', '爱好', '随笔'],
    post: '',
    userInfo: {}
  },
  chooseImage: function() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res)
        // tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths
      }
    })
  },
  formSumbit: function(e) {
    this.data.loading = true
    let openid = app.globalData.openid
    let title = e.detail.value.title || '';
    // let tag = e.detail.value.tag || '';
    let tag = this.data.tag || '';
    let post = this.data.post || '';
    let userInfo = this.data.userInfo;
    if (!(title && post)) {
      util.showModel('参数异常', '标题或正文不可为空！');
      return false;
    }

    let params = {
      openid: openid,
      user: userInfo.nickName,
      head: userInfo.avatarUrl || '',
      title: title,
      tag: tag,
      post: post
    }
    var that = this
    wx.request({
      url: `${config.service.host}/weapp/post`,
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
          console.log('request fail', res.data.error);
          util.showModel('请求失败', res.data.error);
          return false;
        }
      },
      fail: function(error) {
        that.data.loading = false
        util.showModel('请求失败', error);
        console.log('request fail', error);
        return false;
      },
      complete: function(res) {
        that.setData({
          title: '',
          tag: '',
          pickIndex: 0,
          post: ''
        })
      }
    })

  },
  bindPickerChange: function(e) {
    let pickIndex = e.detail.value;
    let tag = this.data.array[pickIndex];
    this.setData({
      pickIndex: pickIndex,
      tag: tag
    })
  },
  bindTextAreaBlur: function(e) {
    this.setData({
      post: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;
    app.checkUserInfo(function(userInfo, isLogin) {
      if (!isLogin) {
        wx.redirectTo({
          url: '../authorization/authorization?backType=post',
        })
      } else {
        let tag = that.data.array[that.data.pickIndex];
        that.setData({
          userInfo: userInfo,
          tag: tag
        });

      }
    });
  }
})