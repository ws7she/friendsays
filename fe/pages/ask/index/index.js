const app = getApp()
const utils = require('../../../utils/util.js'); 
const common = {
  left: '-20rpx',
  right: '50rpx',
  width: '180rpx',
  top: '30rpx',
  fontSize: '18rpx',
  lineHeight: '25rpx',
  color: 'yellow'};
Page({
  data: {
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    sendTo: '',
    question: '',
    bankId: '',
    memberId: '',
    totalMessage: 0,
    askQuestionId: '',
    ModifiyQuestion:true,
    focus:false,
    shareimagePath: '',

    sharePng: {
    },
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
        sharePng: {
          background: '/images/Artboard_M.png',
          width: '254rpx',
          height: '200rpx',
          views: [
            {
              type: 'text',
              text: res.content,
              css: [{
              },common],
            },
          ],
        },
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
  onImgOK(e) {
    this.imagePath = e.detail.path;
    this.setData({
      shareimagePath: e.detail.path
    })
    console.log(e);
  },
  ModifiyQuestion(){
    this.setData({
      ModifiyQuestion: false,
      focus:true
    })
  },
  ModifiyContent(e){
    console.log(e.detail.value)
    this.setData({
      question: e.detail.value,
      sharePng: {
        background: '/images/Artboard_M.png',
        width: '254rpx',
        height: '250rpx',
        views: [
          {
            type: 'text',
            text: e.detail.value,
            css: [{
            },common],
          },
        ],
      },
    })
  },
  ConfirmModifiy(){
    this.setData({
      ModifiyQuestion: true
    })
  },
  CancelModifiy(){
    this.setData({
      ModifiyQuestion: true
    })
  },
  onShareAppMessage(e) {
    let that = this
    console.log(that.data.shareimagePath)
    if (e.type == 'submit') {
      this.getQuestionId(e.detail.formId);
    }
    return {
      title: this.data.question,
      // imageUrl: "/images/Artboard.png",
      imageUrl: that.data.shareimagePath,
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