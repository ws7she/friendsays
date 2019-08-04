// pages/ask/recevieDetail/index.js
const utils = require('../../../utils/util.js')

Page({
  data: {
    questionId: '',
    question: '',
    messagesList: '',
    totalLength: 0,
    startX: 0,
    delBtnWidth: 160,
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
      nickName = wx.getStorageSync('userInfo').nickName
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
  },
  drawStart(e) {
    const touch = e.touches[0]
    this.data.messagesList.map(item => {
      item.right = 0;
    })
    this.setData({
      messagesList: [...this.data.messagesList],
      startX: touch.clientX
    })
  },
  drawMove(e) {
    const touch = e.touches[0]
    const item = this.data.messagesList[e.currentTarget.dataset.index]
    let disX = this.data.startX - touch.clientX
    if (disX >= 20) {
      if (disX > this.data.delBtnWidth) {
        disX = this.data.delBtnWidth
      }
      item.right = disX
      this.setData({
        isScroll: false,
        messagesList: [...this.data.messagesList]
      })
    } else {
      item.right = 0
      this.setData({
        isScroll: true,
        messagesList: [...this.data.messagesList]
      })
    }
  },
  drawEnd(e) {
    var item = this.data.messagesList[e.currentTarget.dataset.index]
    if (item.right >= this.data.delBtnWidth / 2) {
      item.right = this.data.delBtnWidth
      this.setData({
        messagesList: [...this.data.messagesList]
      })
    } else {
      item.right = 0
      this.setData({
        messagesList: [...this.data.messagesList]
      })
    }
  },
  removeAnswer(e) {
    utils.requestApi('answer/opt', {
      method: 'POST',
      data: {
        "answerId": e.currentTarget.dataset.answerid,
        "content": e.currentTarget.dataset.content,
        "type": 0
      }
    }).then(res => {
      this.getAnswers()
    }).catch(e => {
      this.getAnswers()
    })
  }
})
