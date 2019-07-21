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
    tagStatus: false,
    show: false,
    askUserId: ''
  },
  onLoad: function(options) {
    this.Login();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        question: options.question,
        questionId: options.questionId,
        friend_name: options.user,
        askUserId: options.askUserId
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
  Login() {
    let me = this;
    wx.login({
      success(res) {
        if (res.code) {
          utils.requestApi(`member/auth?authCode=${res.code}`).then(data => {
            console.log(me.data.askUserId, data)
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
    let tagId = e.currentTarget.dataset.tag;
    let isDetail = e.currentTarget.dataset.type == 'detail';
    this.data.relation_list.forEach(function(item) {
      if (item.tagId == tagId) {
        if(item.selected == true){
          item.selected = false;
        }else{
          item.selected = true
        }
        
      } 
      if (isDetail) {
        item.tags.forEach(function(tag) {
          console.log(item)
          if (tag.tagId == tagId) {
            if (tag.selected == true) {
              tag.selected = false;
            } else {
              tag.selected = true
            }
          }
        })
      }
    })
    this.setData({
      relation_list: this.data.relation_list
    })
    console.log(this.data.relation_list)
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
      isDisabled:false
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
  checkDisabled() {
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
    return tagIds > 0 && this.data.content
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
    if(this.data.content.trim()===''){
      wx.showToast({
        title: '答案不能为空呦~',
        icon: 'none',
        duration: 2000
      })

    }
    else if(tagIds.length===0){
      wx.showToast({
        title: '选择至少一个关系线索呦~',
        icon: 'none',
        duration: 2000
      })
    }
    else{

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