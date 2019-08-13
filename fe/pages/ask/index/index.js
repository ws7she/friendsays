const app = getApp()
const utils = require('../../../utils/util.js');
Page({
  data: {
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    sendTo: '',
    question: '',
    bankId: '',
    memberId: '',
    totalMessage: 0,
    askQuestionId: ''
  },
  onShow() {
    this.getQuestionCount();
  },
  onReady: function(option) {
    this.getQuestion();
    // this.getQuestionCount();
  },
  getQuestion() {
    return utils.requestApi(`question/next?bankId=${this.data.bankId}`).then(res => {
      this.setData({
        question: res.content,
        sendTo: res.groupName,
        bankId: res.bankId,
        userInfo: wx.getStorageSync('userInfo'),
        memberId: wx.getStorageSync('memberId'),
      })
    });
  },
  getQuestionId(formId) {
    return utils.requestApi(`question/save`, {
      method: 'POST',
      data: {
        bankId: this.data.bankId,
        memberId: this.data.memberId,
        formId
      }
    }).then(res => {
      this.setData({
        askQuestionId: res
      })
    })
  },
  getQuestionCount() {
    return utils.requestApi(`answer/message?memberId=${wx.getStorageSync('memberId')}`).then(res => {
      this.setData({
        totalMessage: res.newCount
      })
    })
  },
  onShareAppMessage(e) {
    if (e.type == 'submit') {
      this.getQuestionId(e.detail.formId);
    }
    return {
      title: this.data.question,
      imageUrl: "/images/Artboard.png",
      path: `/pages/answer/index/index?question=${ this.data.question }&bankId=${ this.data.bankId }&user=${ this.data.userInfo.nickName }&askUserId=${ this.data.memberId }`,
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