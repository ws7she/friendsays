// pages/feedback/index.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

    vx: '13691384714',
    qq: '700801080',
    content: '',
    remark: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },


  contentBindblur: function(e) {
    console.log(e.detail.value)
    this.setData({
      content: e.detail.value,
    })
  },
  remarkBindblur: function(e) {
    console.log(e.detail.value)
    this.setData({
      remark: e.detail.value,
    })
  },



  copyvx() {
    var self = this;
    wx.setClipboardData({
      data: self.data.vx,
      success: function(res) {
        // self.setData({copyTip:true}),
        wx.showModal({
          title: '提示',
          content: '复制成功',
          success: function(res) {
            if (res.confirm) {
              console.log('确定')
            } else if (res.cancel) {
              console.log('取消')
            }
          }
        })
      }
    })
  },
  copyqq() {
    var self = this;
    wx.setClipboardData({
      data: self.data.qq,
      success: function(res) {
        // self.setData({copyTip:true}),
        wx.showModal({
          title: '提示',
          content: '复制成功',
          success: function(res) {
            if (res.confirm) {
              console.log('确定')
            } else if (res.cancel) {
              console.log('取消')
            }
          }
        })
      }
    })
  },
  getfeedback() {
    var self = this;
    console.log('in posting');
    console.log(self.data.content);
    console.log(self.data.remark);

    wx.request({
      url: "http://39.97.229.221:8382/friend/api/feedback/save",
      method: "POST",
      data: {
        content: self.data.content,
        openId: '', //TODO 获取 openID
        remark: self.data.remark
      },
      header: {

        "Content-Type": "application/json"
      },
      success: function(res) {
        console.log(res.data);

        wx.showToast({
          title: '反馈成功！',
          icon: 'success',
          duration: 2000
        })
        setTimeout(function() {
          wx.navigateBack({
            delta: 1 //小程序关闭当前页面返回上一页面
          })
        }, 2000)

      },
      fail: function (res) {
        wx.showToast({
          title: '好像不成功',
          icon: 'none',
          duration: 2000
        })
      }
    })
  }




})