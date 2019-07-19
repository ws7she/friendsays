//app.js
import { requestApi } from './utils/util.js'
App({
  globalData: {
    userInfo: null,
    showFirst: false
  },
  onLaunch: function (option) {
    console.log(option)
    //获取用户信息
    this.getUserInfo(option);
    this.Login();
  },
  getUserInfo: function (option) {
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            this.showFirst = false;
            wx.getUserInfo({
              success: res => {
                // 可以将 re s 发送给后台解码出 unionId
                this.globalData.userInfo = res.userInfo;
                wx.setStorageSync('userInfo', res.userInfo);
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
                console.log(option,1111111122222333)
                if (option.shareTicket) {
                  wx.reLaunch({
                    url: '/pages/answer/index/index',
                  })
                } else {
                  wx.reLaunch({
                    url: '/pages/answer/index/index',
                    // url: '/pages/ask/success/index'
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
  },
  Login: function () {
    const me  = this;
    wx.login({
      success(res) {
        if (res.code) {
          requestApi(`member/auth?authCode=${res.code}`).then(data => {
            wx.setStorageSync('memberId', data);
          })
        }
      }
    })
  }
})