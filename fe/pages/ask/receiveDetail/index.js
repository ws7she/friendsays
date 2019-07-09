// pages/ask/recevieDetail/index.js
const utils = require('../../../utils/util.js');

Page({
  data: {
    bankId: '',
    question: '',
    messagesList: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.bankId = options.questionId;
    // this.getQuestion().then(res => {
    //   this.getAnswers();
    // });


    this.setData({
      bankId: options.questionId,
      question: options.content,

    })
    this.getAnswers();
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
  getQuestion() {
    return utils.requestApi(`question/next?bankId=${this.data.bankId}`).then(res => {
      this.setData({
        question: res.content
      })
    })
  },
  getAnswers() {
    return utils.requestApi(`answer/list?current=0&size=15&questionId=${this.data.bankId}`).then(res => {
      this.setData({
        messagesList: res.content
      })
    })
  }
})