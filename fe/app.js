//app.js
import {
  requestApi
} from './utils/util.js'
App({
  globalData: {
    userInfo: null,
    showFirst: false,
    option: {}
  },
  onLaunch: function(option) {
    //自定义导航栏 
    wx.getSystemInfo({
      success: function(res) {
        wx.setStorageSync('navHeight', res.statusBarHeight)
      }
    })
    //获取用户信息

    this.Login(option)
  },
  getUserInfo: function(option, memberId) {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        const phone = wx.getStorageSync('phone')
        if (res.authSetting['scope.userInfo'] && phone) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          this.showFirst = false;
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo;
              wx.setStorageSync('userInfo', res.userInfo);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
              if (!(wx.getStorageSync('askUserId')) || wx.getStorageSync('memberId') == wx.getStorageSync('askUserId')) {
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
  },
  Login: function(option) {
    const me = this;
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