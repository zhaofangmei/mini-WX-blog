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

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

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

module.exports = { formatTime, deepClone, showBusy, showSuccess, showModel }
