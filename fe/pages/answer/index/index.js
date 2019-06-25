// pages/answer/index/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    friend_name: '进击的大王',
    question: '如果你早上起来发现自己性格发生了转换，你第一件事会是做什么？',
    relation_list: [{
      key: 'classmate',
      value: '同学'
    }, {
        key: 'uclassmate',
        value: '大学同学'
      }, {
        key: 'hclassmate',
        value: '高中同学'
      }, {
        key: 'mclassmate',
        value: '初中同学'
      }, {
        key: 'slassmate',
        value: '小学同学'
      }], 
      relation_list1: [{
        key: 'classmate',
        value: '同学'
      }, {
        key: 'uclassmate',
        value: '大学同学'
      }, {
        key: 'hclassmate',
        value: '高中同学'
      }, {
        key: 'mclassmate',
        value: '初中同学'
      }, {
        key: 'slassmate',
        value: '小学同学'
      }], 
      moreRelation: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log(22222222)
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
  }
})