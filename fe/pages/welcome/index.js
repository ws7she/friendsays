// pages/welcome/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    options: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.options = options;
  },
  getUserInfo() {
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        wx.setStorageSync('userInfo', res.userInfo);
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        try {
          if (this.data.options.shareTicket) {
            wx.reLaunch({
              url: '/pages/answer/index/index',
            })
          } else {
            wx.reLaunch({
              url: '/pages/ask/index/index',
            })
          };
        } catch (e) {
          
        }
        
      }
    })
  }
})