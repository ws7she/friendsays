// pages/ask/receive/index.js
import { requestApi } from '../../../utils/util.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tags: [],
    formId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let memberId = wx.getStorageSync('memberId');
    let me = this
    requestApi(`question/list?memberId=${memberId}`)
      .then(res => {
        me.setData({
          tags: res.content,
        })
      })
      .catch(e => {
        console.log(e)
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function(option) {},

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
  onUnload: function() {},

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
  onShareAppMessage: function() {},
  getQuestionList() {},
  
  go2detail(e) {
    let questionId = e.currentTarget.dataset.questionid,
      question = e.currentTarget.dataset.question,
      formId = e.detail.formId
    requestApi(`question/save`, {
      method: 'POST',
      data: {
        questionId: questionId,
        formId
      }
    }).then(res => {
      wx.navigateTo({
        url: `/pages/ask/receiveDetail/index?questionId=${questionId}&content=${question}`,
      })
    }).catch(e => {
      wx.showToast({
        title: e,
        icon: 'none',
        duration: 2000
      })
    })
    
  }
})
