// pages/components/head.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      default: '朋友说'
    },
    isShow: {
      type: Boolean
    },
    isShowBack: {
      type: Boolean
    },
    isShowHome: {
      type: Boolean
    },
    backGround: {
      type:String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    height: wx.getStorageSync('navHeight')
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goback() {
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      // prevPage.setData({
      //   message: e.currentTarget.dataset.msg,
      // })
      wx.navigateBack({
        delta: 1,
      })
    },
    gohome() {
      wx.reLaunch({
        url: '/pages/ask/index/index',
      })
    }
  }
})
