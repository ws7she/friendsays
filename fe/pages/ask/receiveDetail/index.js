// pages/ask/recevieDetail/index.js
const utils = require('../../../utils/util.js')

Page({
  replyMessage: {},
  data: {
    questionId: '',
    question: '',
    messagesList: '',
    totalLength: 0,
    startX: 0,
    delBtnWidth: 160,
    answerId: '',

    hidden_reply: true,
    nocancel: false,
    hidden_report: true,
    report_nocancel: false,
    report_tag: 'yellow',
    report_items: [{
        name: 'yellow',
        value: '黄色暴力',
        checked: 'true'
      },
      {
        name: '1s',
        value: '政治敏感'
      },
      {
        name: 'rude',
        value: '不礼貌'
      },
      {
        name: 'others',
        value: '其他'
      },

    ],
    replyInfo: {},
    chooseList: ['使用照片做背景', '无背景'],
    chooseType: null
  },
  radioChange: function(e) {
    this.setData({
      report_tag: e.detail.value,
    })

  },
  cancel: function() {
    this.setData({
      hidden_reply: true,
      hidden_report: true
    });
  },
  hidden_reply_confirm: function(e) {
    this.setData({
      hidden_reply: true,
      hidden_report: false,
    });
  },
  hidden_reply: function (e) {
    this.setData({
      hidden_reply: true,
      hidden_report: true,
      // answerId: e.currentTarget.dataset.answerid
    });
  },

  report: function(e) {
    console.log(this.data.answerId)
    console.log(this.data.report_tag)
    this.setData({
      hidden_reply: false,
      hidden_report: true,
      answerId: e.currentTarget.dataset.answerid
    });
  },
  reportfinally: function() {
    var that = this
    let answer_id = this.data.answerId
    let report_tag_content = this.data.report_tag
    console.log(answer_id + report_tag_content)
    wx.request({
      url: 'https://pysapp.com/friend/api/answer/opt',
      method: 'POST',
      data: {
        answerId: answer_id,
        content: report_tag_content,
        type: '1'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        if ('ok' === res.data.message) {
          wx.showToast({
            title: '举报成功',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
        }
        that.setData({
          hidden_reply: true,
          hidden_report: true,
        })
      },
      fail(res) {
        wx.showToast({
          title: '未成功!请检查网络连接',
          icon: 'none',
          duration: 1000,
          mask: true
        })
        that.setData({
          hidden_reply: true,
          hidden_report: true,
        })
      }
    })
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
    if (this.data.messagesList.length === 0) return
    return utils.requestApi(`answer/read`, {
      method: 'POST',
      data: {
        answerIds: questions
      }

    }).then(res => {
      console.log('-----------' + res)
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
  },
  reply_answer(e) {
    const index = e.currentTarget.dataset.reply;
    if (this.replyMessage[index]) {
      this.replyMessage[index].show = true
    } else {
      this.replyMessage[index] = {
        show: true,
        answer: e.currentTarget.dataset.answer,
        tag: e.currentTarget.dataset.tag,
        replyContent: '',
        index
      }
    }
    this.setData({
      replyInfo: this.replyMessage[index]
    })
  },
  hideReply() {
    const info = {...this.data.replyInfo}
    info.show = false;
    this.setData({
      replyInfo: info
    })
  },
  bindTextArea(e) {
    this.replyMessage[this.data.replyInfo.index].replyContent = e.detail.value
    const info = JSON.parse(JSON.stringify(this.data.replyInfo))
    info.replyContent = e.detail.value
    this.setData({
      replyInfo: info
    })
  },
  bindPickerChange(e) {
    const { replyInfo } = this.data
    const userInfo = wx.getStorageSync('userInfo')
    if (e.detail.value == 1) {
      wx.navigateTo({
        url: `/pages/ask/canvas/index?question=${this.data.question}&questionId=${this.data.questionId}&askUserId=${wx.getStorageSync('memberId')}&tag=${replyInfo.tag}&answer=${replyInfo.answer}&replyContent=${replyInfo.replyContent}&user=${userInfo.nickName}`,
        //差了个user
      })
    } else {
      this.shareToFriend(replyInfo, userInfo)
    }
  },
  shareToFriend(replyInfo, userInfo) {
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      sizeType: ['original', 'compressed'],
      success: (res) => {
        const background = res.tempFilePaths[0]
        wx.navigateTo({
          url: `/pages/ask/canvas/index?question=${this.data.question}&questionId=${this.data.questionId}&askUserId=${wx.getStorageSync('memberId')}&tag=${replyInfo.tag}&answer=${replyInfo.answer}&replyContent=${replyInfo.replyContent}&user=${userInfo.nickName}`,
        })
      }
    })
  }
})