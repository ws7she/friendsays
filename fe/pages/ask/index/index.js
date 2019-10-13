const app = getApp()
const utils = require('../../../utils/util.js');

const common = {
  left: '-20rpx',
  right: '50rpx',
  width: '180rpx',
  top: '30rpx',
  fontSize: '18rpx',
  lineHeight: '25rpx',
  color: 'yellow'
};
Page({
  data: {
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    sendTo: '',
    question: '',
    bankId: '',
    memberId: wx.getStorageSync('memberId'),
    totalMessage: 0,
    askQuestionId: '',

    questionChanged: '',
    ModifiyStatus: true,
    focus: false,
    shareimagePath: '',

    sharePng: {},
    chooseList: ['使用照片做背景', '无背景'],
    chooseType: null,
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
        questionChanged: '',
        question: res.content,
        sendTo: res.groupName,
        bankId: res.bankId,
        userInfo: wx.getStorageSync('userInfo'),
        sharePng: {
          background: '/images/Artboard_M.png',
          width: '254rpx',
          height: '200rpx',
          views: [{
            type: 'text',
            text: res.content,
            css: [{}, common],
          }, ],
        },
      })
    });
  },
  getQuestionId(formId) {
    const data = {
      memberId: this.data.memberId,
      formId,
    }
    if (this.data.questionChanged) {
      data.content = this.data.question
    } else {
      data.bankId = this.data.bankId
    }
    return utils.requestApi(`question/save`, {
      method: 'POST',
      data
    })
  },
  getQuestionCount() {
    return utils.requestApi(`answer/message?memberId=${wx.getStorageSync('memberId')}`).then(res => {
      this.setData({
        totalMessage: res.newCount
      })
    })
  },
  onImgOK(e) {
    this.imagePath = e.detail.path;
    this.setData({
      shareimagePath: e.detail.path
    })
  },

  changeContent(e) {
    this.setData({
      questionChanged: e.detail.value
    })
  },
  
  ModifiyShow() {
    this.setData({
      questionChanged: this.data.question,
      ModifiyStatus: false,
      focus: true
    })
  },

  setModifiyContent() {
    utils.requestApi('question/msgCheck', {
      method: 'POST',
      data: {
        "content": this.data.questionChanged,
      }
    }).then(() => {
      this.setData({
        sharePng: {
          background: '/images/Artboard_M.png',
          width: '254rpx',
          height: '250rpx',
          views: [{
            type: 'text',
            text: this.data.questionChanged,
            css: [{}, common],
          },],
        },
        ModifiyStatus: true,
        question: this.data.questionChanged
      })
    })
    
  },

  CancelModifiy() {
    this.setData({
      questionChanged: '',
      ModifiyStatus: true,
    })
  },

  ConfirmModifiy(e) {
    this.setData({
      ModifiyQuestion: true
    })
  },
  
  onShareAppMessage(e) {
    if (e.type == 'submit') {
      this.getQuestionId(e.detail.formId)
    }
    let path
    if (this.data.questionChanged) {
      path = `/pages/answer/index/index?question=${this.data.question}&user=${this.data.userInfo.nickName}&askUserId=${this.data.memberId}&questionChanged=${this.data.questionChanged}`
    } else {
      path = `/pages/answer/index/index?question=${this.data.question}&bankId=${this.data.bankId}&user=${this.data.userInfo.nickName}&askUserId=${this.data.memberId}`
    }
    return {
      title: this.data.question,
      imageUrl: this.data.shareimagePath,
      path,
    }
  },
  go2welcome() {
    wx.navigateTo({
      url: `/pages/welcome/index`
    })
  },
  go2receive() {
    wx.navigateTo({
      url: `/pages/ask/receive/index?bankId=${this.data.bankId}`
    })
  },
  bindPickerChange(e) {
    if (e.detail.value == 1) {
      wx.navigateTo({
        url: `/pages/ask/canvas/index?question=${this.data.question}&bankId=${this.data.bankId}&user=${this.data.userInfo.nickName}&askUserId=${this.data.memberId}&questionChanged=${this.data.questionChanged}`,
      })
    } else {
      this.shareToFriend()
    }

  },
  shareToFriend() {
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      sizeType: ['original', 'compressed'],
      success: (res) => {
        const background = res.tempFilePaths[0]
        wx.navigateTo({
          url: `/pages/ask/canvas/index?background=${background}&question=${this.data.question}&bankId=${this.data.bankId}&user=${this.data.userInfo.nickName}&askUserId=${this.data.memberId}&questionChanged=${this.data.questionChanged ? true : false}`,
        })
      },
    })
  }
})