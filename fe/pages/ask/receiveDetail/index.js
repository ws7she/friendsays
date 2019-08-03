// pages/ask/recevieDetail/index.js
const utils = require('../../../utils/util.js')

Page({
  data: {
    questionId: '',
    question: '',
    messagesList: '',
    totalLength: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.questionId = options.questionId;
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
  onUnload: function() {
    this.readAnswers();
  },

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
  onShareAppMessage(options) {
    let memberId = wx.getStorageSync('memberId'),
      nickName = wx.getStorageSync('userIndo').nickName
    return {
      title: this.data.question,
      imageUrl: "/images/Artboard.png",
      path: `/pages/answer/index/index?question=${this.data.question}&questionId=${this.data.questionId}&user=${nickName}&askUserId=${memberId}`,
    }
  },
  getAnswers() {
    return utils.requestApi(`answer/list?questionId=${this.data.questionId}`).then(res => {
      this.setData({
        messagesList: res.content,
        totalLength: res.total
      })
    })
  },
  readAnswers() {
    let questions = this.data.messagesList.map(function(item) {
      return item.answerId
    });
    if (questions.length === 0) return
    return utils.requestApi(`answer/read`, {
      method: 'POST',
      data: {
        answerIds: questions
      }
      
    }).then(res => {
      console.log(res)
    })
  }
})
