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
    console.log(e.detail)
    wx.setStorageSync('phone', e.detail.encryptedData)
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      utils.requestApi(`member/save`, {
        method: 'POST',
        data: Object.assign(wx.getStorageSync('userInfo'), {
          memberId: wx.getStorageSync('memberId'),
          iv: e.detail.encryptedData
        })
      })
      try {
        const askUserId = wx.getStorageSync('askUserId')
        if (askUserId && (askUserId != wx.getStorageSync('memberId'))) {
          wx.reLaunch({
            url: `/pages/answer/index/index?question=${wx.getStorageSync('question')}&bankId=${wx.getStorageSync('bankId')} &user=${wx.getStorageSync('nickName')} &askUserId=${wx.getStorageSync('askUserId')}`,
          })
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
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        wx.setStorageSync('userInfo', res.userInfo);
        this.setData({
          showPhone: true
        })
      }
    })
  }
})