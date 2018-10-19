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
    wx.hideToast();

    wx.showModal({
        title,
        content: JSON.stringify(content),
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

async function request(options, page, tryout, successCB, failCB) {
  if (tryout === 0) {
    return
  }
  let tryTmp = 0
  let result = 0
  let failTmp = 0
  while (tryTmp++ < tryout && !result) {
    if (tryTmp > 2) await sleep(3)

    failTmp = await tryRequest(options)

    if (failTmp.data && (failTmp.data.code || failTmp.data.code === 0)) {
      result = failTmp
    }
  }
  if (result) {
    successCB.call(page, result)
  } else {
    failCB.call(page, failTmp)
  }

  if (options.tip) {
    tip.loaded()
  }
}

async function tryRequest(options) {
  return new Promise((resolve, reject) => {
    if (options.tip) {
      tip.loading()
    }
    wx.request({
      method: options.method || 'GET',
      data: options.data || {},
      header: options.header || {},
      url: options.url,
      success: function (res) {
        resolve(res)
      },
      fail: function (err) {
        console.log('try err:', err)
        if (!err.code) {
          resolve(0)
        } else {
          resolve(err)
          console.log('请求失败url', options.url)
          console.log('请求失败', err)
        }
      },
      complete: function (res) {
        // console.log(res)
      }
    })
  })
}

async function sleep(sec) {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('sleep ' + sec + ' seconds')
      resolve(true)
    }, sec * 1000)
  })
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
