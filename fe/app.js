//app.js
import { requestApi } from './utils/util.js'
App({
  globalData: {
    userInfo: null,
    showFirst: false
  },
  onLaunch: function (option) {
    //获取用户信息
    this.Login(option)
  },
  getUserInfo: function (option, memberId) {
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            this.showFirst = false;
            wx.getUserInfo({
              success: res => {
                // 可以将 re s 发送给后台解码出 unionId
                requestApi(`member/save`, {
                  method: 'POST',
                  data: Object.assign(res.userInfo, {
                    memberId: memberId
                  })
                })
                this.globalData.userInfo = res.userInfo;
                wx.setStorageSync('userInfo', res.userInfo);
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
                if (option.shareTicket && memberId != wx.getStorageSync('memberId')) {
                  wx.reLaunch({
                    url: '/pages/answer/index/index',
                  })
                } else {
                  wx.reLaunch({
                    url: '/pages/ask/index/index',
                    // url: '/pages/answer/index/index',

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
  Login: function (option) {
    const me  = this;
    wx.login({
      success(res) {
        if (res.code) {
          requestApi(`member/auth?authCode=${res.code}`).then(data => {
            wx.setStorageSync('memberId', data);
            me.getUserInfo(option, data);
          })
        }
      }
    })
  }
})