const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const requestApi = (urlparams, requestInfo = {}, option = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `http://39.97.229.221:8382/friend/api/${urlparams}`,
      method: requestInfo.method ? requestInfo.method : 'GET',
      data: requestInfo.data || {},
      // header: option.header ? option.header : 'application/json',
      success: function(res) {
        resolve(res.data.data);
      },
      fail: function(e) {
        reject(e);
      }
    })
  })
}
module.exports = {
  formatTime: formatTime,
  requestApi: requestApi
}
