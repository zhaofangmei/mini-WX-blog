// pages/article/article.js
const app = getApp()
const config = require('../../config')
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    replyIndex: '',
    commentList: [],
    comment: '',
    hiddenmodal: true,
    isCurrUser: false,
    article: ''
  },

  goBack: function() {
    wx.switchTab({
      url: '../home/home',
    })
  },

  editHandler: function(e) {
    if (this.data.isCurrUser) {
      let articleId = e.currentTarget.id;
      wx.navigateTo({
        url: '../eidt/eidt?articleId=' + articleId,
      })
    } else {
      util.showModel('提示', '当前用户不可编辑')
    }
  },

  replyTo: function(e) {
    let replyIndex = parseInt(e.target.dataset.index)
    this.setData({
      replyIndex: replyIndex,
      comment: '',
      hiddenmodal: !this.data.hiddenmodal
    })
  },

  bindTextArea: function(e) {
    let comment = e.detail.value
    this.setData({
      comment: comment
    })
  },

  //取消按钮
  cancelModal: function() {
    this.setData({
      comment: '',
      hiddenmodal: true
    });
  },
  //确认按钮
  confirmModal: function() {
    debugger
    let comment = this.data.comment
    let userInfo = app.globalData.userInfo
    let openid = app.globalData.openid
    let postid = this.data.article.id
    let replyIndex = this.data.replyIndex
    let replyer = ''
    if (typeof replyIndex == 'number') {
      let replyComment = this.data.commentList[replyIndex]
      replyer = replyComment.user
    }
    if (!comment) {
      util.showModel('参数异常', '评论不可为空！');
      return false;
    }
    let params = {
      comment: comment,
      user: userInfo.nickName,
      openid: openid,
      postid: postid,
      replyer: replyer
    }

    wx.request({
      url: `${config.service.host}/weapp/comment/save`,
      method: 'POST',
      data: params,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        if (res.data.code === 0) {
          util.showSuccess('操作成功！')
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

    wx.reLaunch({
      url: '../article/article?articleId=' + postid,
    })

    this.setData({
      comment: '',
      hiddenmodal: true
    })
  },

  commentHandler: function() {
    this.setData({
      hiddenmodal: !this.data.hiddenmodal
    })
  },

  delRequest: function(id) {
    wx.request({
      url: `${config.service.host}/weapp//article/delete`,
      data: {
        id: id
      },
      method: 'GET',
      header: {
        'Context-Type': 'application/json'
      },
      success: function(res) {
        if (res.data.code == 0) {
          util.showSuccess('操作成功');
          wx.switchTab({
            url: '../home/home',
          })
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

  delHandler: function(e) {
    if (this.data.isCurrUser) {
      let that = this
      wx.showModal({
        title: '删除',
        content: '是否删除该文章？',
        success: function(res) {
          if (res.confirm) {
            let articleId = e.currentTarget.id;
            that.delRequest(articleId);

          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      util.showModel('提示', '当前用户不可删除')
    }
  },

  getComments: function(postid) {
    if (!postid) postid = this.data.article.id
    let that = this
    wx.request({
      url: `${config.service.host}/weapp/comment/list`,
      data: {
        postid: postid
      },
      method: 'GET',
      header: {
        'Context-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 0) {
          let data = res.data.data || []
          for(var item of data) {
            item.ctime = util.formatTime(item.ctime)
          }
          that.setData({
            commentList: data
          })

        } else {
          that.setData({
            commentList: []
          })
          console.log('请求失败', res.data.error);
          return false;
        }
      },
      fail: function (err) {
        that.setData({
          commentList: []
        })
        console.log('请求失败', error);
        console.log('request fail', error);
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
          that.setData({
            article: data[0] || ''
          })
          let currOpenId = app.globalData.openid || ''
          let articleOpenId = that.data.article.openid
          if (currOpenId != articleOpenId) {
            that.data.isCurrUser = false
          } else {
            that.data.isCurrUser = true
          }

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
  onLoad: function(options) {
    let that = this
    let articleId = options.articleId || ''
    app.checkUserInfo(function(userInfo, isLogin) {
      if (!isLogin) {
        wx.redirectTo({
          url: '../authorization/authorization?backType=' + articleId,
        })
      } else {
        that.getData(articleId)
        that.getComments(articleId)
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: this.data.article.title,
      path: '/pages/detail/detail?articleId=' + this.data.article.id
    }
  }
})