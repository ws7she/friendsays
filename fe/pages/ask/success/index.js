
Page({
  data: {
    sendTo: '好朋友',
    question: '111如果你早上起来发现自己性格发生了转换，你第一件事会是做什么？'
  },
  onLoad: function (options) {
    var self = this;
    var random_bankid = Math.floor(Math.random() * 100 + 1)
    console.log(random_bankid)
    wx.request({
      url: 'http://39.97.229.221:8382/friend/api/question/next?bankId='+random_bankid,
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res){
        var load_question = res.data.data.content;
        console.log(load_question)
        self.setData({
          question:load_question
        })
      }
    })
  },
  go2ask:function(){
    wx.navigateTo({

      url: '/pages/ask/index/index',

    })
  }
})