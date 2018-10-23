//时间格式化
const formatTime = time => {
  time = (time.length == 10) ? parseInt(time) * 1000 : parseInt(time)
  var date = new Date(time);
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') 
}

// 数据格式化
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 深拷贝
const deepClone = obj => {
  const _this = this;
  var temp = null;
  if (obj && obj instanceof Array) {
    temp = [];
    temp = obj.map(function (item) {
      return deepClone(item);
    });
  } else if (obj && typeof obj === 'object') { // typeof null 的值是 object
    temp = {};
    for (let item in obj) {
      temp[item] = deepClone(obj[item]);
    }
  } else {
    temp = obj;
  }
  return temp;
}

// 复制粘贴
const clip = (obj) => {
  wx.setClipboardData(obj)
}


// 显示繁忙提示
var showBusy = (text, duration )=> wx.showToast({
    title: text,
    icon: 'loading',
  duration: duration
})

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
})

// 显示失败提示
var showModel = (title, content) => {
    if (!content) content = ''
    content = typeof content === 'string' ? content : JSON.stringify(content)
    wx.hideToast();
    wx.showModal({
        title,
        content: content,
        showCancel: false
    })
}

// 显示提示
var showTip = (text, duration) => wx.showToast({
  title: text,
  icon: 'none',
  duration: duration || 1500
})

// 弹出加载提示
const loading = (title = '加载中') => {
  wx.showLoading({
    title: title,
    mask: true
  })
}

//加载完毕
const loaded = () => {
  wx.hideLoading()
}


const request = function(options) {
  if (options.tip) {
    loading()
  }
  const promise = new Promise((resolve, reject) => {
    wx.request({
      url: options.url,
      data: options.data || {},
      header: options.header ||  {},
      method: options.method || 'GET',
      success: function (res) {     
        resolve(res)
      },
      fail: function (err) {
        console.log('request err', err)
        reject(err)
      },
      complete: function(res) {
        console.log(options.url + ': request res', res)
        if (options.tip) {
          loaded()
        }
      }
    })
  });

  return promise;
}

module.exports = {
  formatTime,
  deepClone,
  clip,
  showBusy,
  showSuccess,
  showModel,
  showTip,
  loading,
  loaded,
  request
}
