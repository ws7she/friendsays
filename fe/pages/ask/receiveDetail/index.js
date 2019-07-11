// pages/ask/recevieDetail/index.js
const utils = require('../../../utils/util.js')

Page({
  data: {
    questionId: '',
    question: '',
    messagesList: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.questionId = options.questionId;
    // this.data.questionId = '2c911b676bb30ce3016bcca459a50018'
    this.setData({
      question: options.content,
    })
    this.getAnswers()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  getAnswers() {
    return utils.requestApi(`answer/list?questionId=${this.data.questionId}`).then(res => {
      this.setData({
        messagesList: res.content,
      })
    })
  },
})
