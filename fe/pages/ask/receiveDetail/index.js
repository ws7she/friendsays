// pages/ask/recevieDetail/index.js
const utils = require('../../../utils/util.js')

Page({
  data: {
    questionId: '',
    question: '',
    messagesList: '',
    answerId: '',

    hidden_reply: true,
    nocancel: true,
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

    ]
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
      fail(res){
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
    // return utils.requestApi('answer/opt',{
    //   method: 'POST',
    //   data: {
    //     answerId: answer_id,
    //     content: report_tag_content,
    //     type: '1',
    //   }
    // }).then(res => {
    //     console.log(res.data.data)
    //   })
    //   .catch(e => {
    //     console.log(e)
    //   })

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
      console.log('-----------' + res.data)
      this.setData({
        messagesList: res.content,
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
      console.log('-----------' + res)
    })
  }
})