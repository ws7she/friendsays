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
    tagStatus: false
  },
  onLoad: function(options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        question: options.question,
        questionId: options.questionId,
        friend_name: options.user
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onReady: function(options) {
    this.getTags();
  },

  onShareAppMessage: function() {
    console.log(22222222)
  },
  chooseTag(e) {
    let tagId = e.currentTarget.dataset.tag;
    let isDetail = e.currentTarget.dataset.type == 'detail';
    this.data.relation_list.forEach(function(item) {
      if (item.tagId == tagId) {
        item.selected = true;
      }
      if (isDetail) {
        item.tags.forEach(function(tag) {
          if (tag.tagId == tagId) {
            tag.selected = true;
          }
        })
      }
    })
    this.setData({
      relation_list: this.data.relation_list
    })
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
      moreRelation: true
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
    let tagIds = [];
    this.data.relation_list.forEach(item => {
      if (item.selected) {
        tagIds.push(item.tagId);
      }
      item.tags.forEach(tag => {
        if (tag.selected) {
          tagIds.push(tag.tagId);
        }
      })
    })
    utils.requestApi('answer/save', {
      method: 'POST',
      data: {
        content: this.data.content,
        memberId: memberId,
        questionId: this.data.questionId,
        tagIds: tagIds,
        tagStatus: this.data.tagStatus,
        status: 1
      }
    }).then(res => {
      wx.navigateTo({
        url: '/pages/ask/success/index',
      })
    })
  }
})