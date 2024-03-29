// pages/welcome/index.js
const utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: false,
    options: null,
    currentSwiper: 0,
    showPhone: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      options: options
    })
  },
  swiperChange(e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  },
  refusePhone() {
    this.setData({
      showPhone: false
    })
  },
  getPhoneNumber(e) {
    // wx.setStorageSync('phone', e.detail.encryptedData)
    let userInfo = wx.getStorageSync('userInfo');
    // if (e.detail.errMsg == 'getPhoneNumber:ok') {
    if (true) {
      utils.requestApi(`member/save`, {
        method: 'POST',
        data: {
          userData: userInfo.encryptedData,
          userIV: userInfo.iv,
          memberId: wx.getStorageSync('memberId'),
          // phoneData: e.detail.encryptedData,
          // phoneIV: e.detail.iv
        }
      })
      try {
        const askUserId = wx.getStorageSync('askUserId')
        if (askUserId && (askUserId != wx.getStorageSync('memberId'))) {
          if (wx.getStorageSync('questionId')) {
            wx.reLaunch({
              url: `/pages/answer/index/index?question=${wx.getStorageSync('question')}&questionId=${wx.getStorageSync('questionId')} &user=${wx.getStorageSync('nickName')} &askUserId=${wx.getStorageSync('askUserId')}`,
            })
          } else {
            wx.reLaunch({
              url: `/pages/answer/index/index?question=${wx.getStorageSync('question')}&bankId=${wx.getStorageSync('bankId')} &user=${wx.getStorageSync('nickName')} &askUserId=${wx.getStorageSync('askUserId')}`,
            })
          }
          
        } else {
          wx.reLaunch({
            url: '/pages/ask/index/index',
          })
        };
      } catch (e) {

      }
    } else {
      this.setData({
        showPhone: false
      })
    }
  },
  
  getUserInfo() {
    let me = this
    wx.login({
      success(res) {
        if (res.code) {
          utils.requestApi(`member/auth?authCode=${res.code}`).then(data => {
            wx.getUserInfo({
              success: res => {
                wx.setStorageSync('memberId', data);
                // 可以将 res 发送给后台解码出 unionId
                wx.setStorageSync('userInfo', {
                  ...res.userInfo,
                  encryptedData: res.encryptedData,
                  iv: res.iv
                });
                me.setData({
                  // showPhone: true
                  showPhone: false
                })
                me.getPhoneNumber()
              }
            })
          })
        }
      }
    })
  }
})