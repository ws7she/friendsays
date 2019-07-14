import { requestApi } from '../../../utils/util.js'

Page({
  data: {
    sendTo: '好朋友',
    question: ''
  },
  onLoad: function (options) {
    var self = this;
    var random_bankid = Math.floor(Math.random() * 100 + 1)
    console.log(random_bankid)
    requestApi(`question/next?bankId=${random_bankid}`).then(res => {
      this.setData({
        question: res.content
      })
    })
  },
  go2ask:function(){
    wx.navigateTo({
      url: '/pages/ask/index/index',
    })
  }
})