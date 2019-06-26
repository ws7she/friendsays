const app = getApp()
const utils = require('../../../utils/util.js');
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    sendTo: '',
    question: ''
  },
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    this.chechUser().then(res => {
      this.getQuestion();
    })
  },
  chechUser: function() {
    return new Promise((resolve, reject) => {
      if (app.globalData.userInfo) {
        this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        });
        resolve('ok');
      } else if (this.data.canIUse) {
        app.userInfoReadyCallback = res => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
          resolve('ok');
        }
      } else {
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            });
            resolve('ok');
          }
        })
      };
    })
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getQuestion() {
    return utils.requestApi('/question/next').then(res => {
      this.setData({
        question: res.content,
        sendTo: res.groupName
      })
    });
  },
  onShareAppMessage(options) {
    return {
      title: "转发给好友",
      imageUrl: "",
      path: "/pages/answer/index/index"
    }
  }
})