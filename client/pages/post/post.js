// pages/post/post.js
const app = getApp()
const config = require('../../config')
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tag: '',
    title: '',
    pickIndex: 0,
    array: ['常用', '爱好', '随笔'],
    post: '',
    userInfo: {}
  },
  formSumbit: function(e) {
    debugger
    let title = e.detail.value.title || '';
    let tag = e.detail.value.tag || '';
    let post = this.data.post || '';
    let userInfo = this.data.userInfo;
    if (!(title && post)) {
      util.showModel('参数异常', '标题或正文不可为空！');
      return false;
    }
    let params = {
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
      success: function (res) {
        if (res.data.code === 0) {
          util.showSuccess('操作成功！')
          console.log('!!!!!!!!!!!!:', res.data.data)
          wx.switchTab({
            url: '../home/home',
          })

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
  onLoad: function (options) {
    const that = this;
    app.checkUserInfo(function (userInfo, isLogin) {
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