// pages/answer/index/index.js
const utils = require('../../../utils/util.js');

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    friend_name: '',
    question: '',
    questionId: '',
    relation_list: [],
    moreRelation: false,
    content: '',
    tagStatus: true,
    show: false,
    askUserId: '',
    choose_list: [],
  },
  onLoad: function(options) {
    let me = this;
    wx.setStorageSync('askUserId', options.askUserId);
    wx.setStorageSync('question', options.question);
    wx.setStorageSync('bankId', options.bankId);
    wx.setStorageSync('nickName', options.user);
    me.setData({
      userInfo: wx.getStorageSync('userInfo'),
      question: options.question,
      friend_name: options.user,
      askUserId: options.askUserId,
    })
    me.Login();
    utils.requestApi(`question/getQuestion?bankId=${options.bankId}&memberId=${options.askUserId}`).then(res => {
      me.setData({
        questionId: res.questionId,
      })
    })
  },
  onShow() {},
  /**
   * 生命周期函数--监听页面加载
   */
  onReady: function(options) {
    this.getTags();
  },

  onShareAppMessage: function() {
    console.log(22222222)
  },
  Login() {
    let me = this;
    wx.login({
      success(res) {
        if (res.code) {
          utils.requestApi(`member/auth?authCode=${res.code}`).then(data => {
            if (data == me.data.askUserId) {
              wx.reLaunch({
                url: '/pages/ask/index/index',
              })
            } else {
              me.setData({
                show: true
              })
            }
          })
        }
      }
    })
  },
  chooseTag(e) {
    if (this.data.choose_list.length >= 5) {
      wx.showToast({
        title: '最多只能选择5个标签呦~',
        icon: 'none',
        duration: 2000
      })
    } else {
      let tagId = e.currentTarget.dataset.tag;
      let isDetail = e.currentTarget.dataset.type == 'detail';
      const me = this;
      const index = me.data.choose_list.indexOf(tagId);
      if (index > -1) {
        const arr = [...me.data.choose_list]
        arr.splice(index, 1)
        this.setData({
          choose_list: arr
        })
      } else {
        this.setData({
          choose_list: [...me.data.choose_list, tagId]
        })
      }
    }
    return false;
  },
  getTags() {
    return utils.requestApi('answer/tag?type=1').then(res => {
      this.setData({
        relation_list: res || []
      })
    })
  },
  //以下是自定义事件
  showMore() {
    this.setData({
      moreRelation: true,
      isDisabled: false
    })
  },
  chooseRelation() {
    this.setData({
      moreRelation: false
    })
  },
  bindTextArea(e) {
    this.setData({
      content: e.detail.value
    })
  },
  sendAnswer() {
    let memberId = wx.getStorageSync('memberId');
    let tagIds = this.data.choose_list;
    if (this.data.content.trim() === '') {
      wx.showToast({
        title: '答案不能为空呦~',
        icon: 'none',
        duration: 2000
      })

    } else if (tagIds.length === 0) {
      wx.showToast({
        title: '选择至少一个关系线索呦~',
        icon: 'none',
        duration: 2000
      })
    } else {

      utils.requestApi('answer/save', {
        method: 'POST',
        data: {
          content: this.data.content,
          memberId: memberId,
          questionId: this.data.questionId,
          tagIds: tagIds,
          tagStatus: this.data.tagStatus ? 1 : 0,
        }
      }).then(res => {
        wx.navigateTo({
          url: '/pages/ask/success/index',
        })
      })
    }

  }
})