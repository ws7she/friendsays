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
      url: `https://pysapp.com/friend/api/${urlparams}`,
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
const Login = function(option) {
  let that = this;
  return wx.login({
    success(res) {
      if (res.code) {
        requestApi(`member/auth?authCode=${res.code}`).then(data => {
          wx.setStorageSync('memberId', data);
          getUserInfo(option, data, that);
          debugger
        })
      }
    }
  })
}
const getUserInfo = (option, memberId, that) => {
  // 获取用户信息
  wx.getSetting({
    success: res => {
      if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        wx.getUserInfo({
          success: res => {
            // 可以将 res 发送给后台解码出 unionId
            that.globalData.userInfo = res.userInfo;
            wx.setStorageSync('userInfo', res.userInfo);
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (that.userInfoReadyCallback) {
              that.userInfoReadyCallback(res)
            }
            if (option.shareTicket && memberId != wx.getStorageSync('memberId')) {
              wx.reLaunch({
                url: '/pages/answer/index/index',
              })
            } else {
              wx.reLaunch({
                url: '/pages/ask/index/index',
              })
            };
          }
        })
      } else {
        wx.redirectTo({
          url: '/pages/welcome/index',
        })
      }
    }
  })
}
module.exports = {
  formatTime: formatTime,
  requestApi: requestApi,
  Login,
  getUserInfo
}
