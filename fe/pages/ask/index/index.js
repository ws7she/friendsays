const app = getApp()
const utils = require('../../../utils/util.js');
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    sendTo: '',
    question: '',
    bankId: ''
  },
  onLoad: function() {
    this.checkUser().then(res => {
      this.getQuestion();
    })
  },
  checkUser: function() {
    wx.login({
      success(res) {
        debugger
      }
    })
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
          },
        })
      };
    })
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo;
    app.globalData.iv = e.detail.iv;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
  },
  getQuestion() {
    return utils.requestApi('question/next').then(res => {
      this.setData({
        question: res.content,
        sendTo: res.groupName,
        bankId: res.bankId
      })
    });
  },
  onShareAppMessage(options) {
    return {
      title: this.question,
      imageUrl: "",
      path: "/pages/answer/index/index"
    }
  },
  go2receive() {
    wx.navigateTo({
      url: `/pages/ask/receive/index?bankId=${this.data.bankId}`
    })
  },
  getUserId() {
    wx.login({
      success(res) {
        // if ()
      }
    })
  },
  saveUser() {
    utils.requestApi(`member/info?openId=${app.globalData.iv}`).then(res => {
      debugger
    })
  }
})