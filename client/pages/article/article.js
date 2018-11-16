// pages/article/article.js
const app = getApp()
const config = require('../../config')
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageList: [],
    isReload: 0,
    articleId: '',
    replyItem: '',
    commentList: [],
    comment: '',
    hiddenmodal: true,
    isCurrUser: false,
    article: ''
  },

  previewImg: function(e) {
    let index = e.currentTarget.dataset.index;
    let imgArr = [];
    this.data.imageList.map(item => {
      imgArr.push(item.pic)
    })
    wx.previewImage({
      current: imgArr[index],     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  replyToEvent: function(e) {
    let item = e.detail.data
    // console.log('parent...', item)
    this.setData({
      replyItem: item,
      hiddenmodal: false
    })
    
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
    let replyItem = e.target.dataset.item
    this.setData({
      replyItem: replyItem,
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
    let comment = this.data.comment
    let userInfo = app.globalData.userInfo
    let openid = app.globalData.openid
    let postid = this.data.article.id
    let replyItem = this.data.replyItem
    let replyer = ''
    let parentid = ''
    // console.log('>>>>>>>>>replyItem:', replyItem)
    if (replyItem != '') {
      replyer = replyItem.user
      parentid = replyItem.id
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
      parentid: parentid,
      replyer: replyer
    }
    let options = {
      url: `${config.service.host}/weapp/comment/save`,
      method: 'POST',
      data: params,
      header: {
        'content-type': 'application/json'
      }
    }
    util.request(options).then((res) => {
      if (res.data.code === 0) {
        util.showSuccess('操作成功！')
        //判断是否有打开过页面
        if (getCurrentPages().length != 0) {
          //刷新当前页面的数据
          getCurrentPages()[getCurrentPages().length - 1].onLoad()
        }
      } else {
        util.showModel('请求失败', res.data.error);
        return false;
      }
    }).catch((error) => {
      util.showModel('请求失败', error);
      console.log('request fail', error);
      return false;
    });
    this.setData({
      comment: '',
      replyItem: '',
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
    let options = {
      url: `${config.service.host}/weapp/comment/list`,
      data: {
        postid: postid
      },
      method: 'GET',
      header: {
        'Context-Type': 'application/json'
      },
      tip: true
    }
    util.request(options).then((res) => {
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
    }).catch((err) => {
      that.setData({
        commentList: []
      })
      console.log('请求失败', error);
      console.log('request fail', error);
      return false;
    });
  },

  getData: function(id) {
    let that = this
    wx.request({
      url: `${config.service.host}/weapp/article`,
      data: {
        isReload: that.data.isReload,
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
            item.imgpath = JSON.parse(item.imgpath)
          }
          that.setData({
            article: data[0] || '',
            imageList: data[0].imgpath || [],
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
    // console.log('article onload......:', app.globalData.openid)
    let that = this 
    if (options) {
      let articleId = options.articleId || ''
      that.setData({
        isReload: 0,
        articleId: articleId
      })
    } else {
      that.setData({
        isReload: 1
      })
    }
    app.checkUserInfo(function(userInfo, isLogin) {
      if (!isLogin) {
        wx.redirectTo({
          url: '../authorization/authorization?backType=' + that.data.articleId,
        })
      } else {       
        that.getData(that.data.articleId)
        that.getComments(that.data.articleId)
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(e) {
    return app.appShareHandle()
  }
})