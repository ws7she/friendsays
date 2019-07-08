const app = getApp()
const utils = require('../../../utils/util.js');
Page({
  data: {
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    sendTo: '',
    question: '',
    bankId: ''
  },
  onLoad: function() {
    this.getQuestion();
  },
  getQuestion() {
    return utils.requestApi(`question/next`).then(res => {
      this.setData({
        question: res.content,
        sendTo: res.groupName,
        bankId: res.bankId,
        userInfo: wx.getStorageSync('userInfo')
      })
    });
  },
  onShareAppMessage(options) {
    debugger
    return {
      title: this.data.question,
      imageUrl: "/images/Artboard.png",
      path: "/pages/answer/index/index",
      success: function(res) {
        debugger
        this.sendQuestion();
      },
      fail: function(res) {
        debugger
      }
    }
  },
  go2receive() {
    wx.navigateTo({
      url: `/pages/ask/receive/index?bankId=${this.data.bankId}`
    })
  },
  sendQuestion() {

  }
})