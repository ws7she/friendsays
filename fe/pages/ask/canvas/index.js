// pages/ask/canvas/index.js
import { roundRect, drawText, requestApi, base64_encode } from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radarImg: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const scene = encodeURIComponent(`bankId=${options.bankId}&user=${options.user}&askUserId=${options.askUserId }`)
    console.log(base64_encode(scene))
    // requestApi(`member/getQRCode?page=page/answer/index/index&scene=${scene}`).then((res) => {
    //   this.drawUserInfo(options, res.path)
    // })

    this.drawUserInfo(options)
  },
  drawUserInfo(options, qrCode) {
    const userImage = wx.getStorageSync('userInfo').avatarUrl
    wx.getImageInfo({
      src: userImage,
      success: (res) => {
        this.drawCanvas(options.background, options.question, res.path, qrCode)
      },
      fail: (e) => {
        wx.showToast({
          title: `${JSON.stringify(e.errMsg)}`,
          icon: 'fail'
        })
      }
    })
  },
  drawCanvas(image, question, userImage, qrCode) {
    const ctx = wx.createCanvasContext('canvas');
    const { windowWidth, windowHeight } = wx.getSystemInfoSync()
    const picCenter = windowWidth / 2 - 40
    const textCenter= windowWidth / 2 - 125
    const rectCenter = windowWidth / 2 - 150
    if (image) {
      ctx.drawImage(image, 0, 0, windowWidth, windowHeight - 86)
    } else {
      ctx.setFillStyle('#f2f2f2')
      ctx.fillRect(0, 0, windowWidth, windowHeight - 86)
    }
    ctx.save()
    
    ctx.setFillStyle('#c3c3c3')
    ctx.setFontSize(12)
    ctx.fillText('长按扫一扫即可匿名回复Ta!', 20, windowHeight - 150)
    ctx.save()

    roundRect(ctx, rectCenter, 140, 300, 200, 10)
    ctx.setFillStyle('#fff')
    ctx.fillRect(rectCenter, 140, 300, 200)
    ctx.restore()

    ctx.setFillStyle('#000')
    ctx.setFontSize(16)
    drawText(ctx, question, textCenter, 220, 180, windowWidth - (textCenter * 2))
    ctx.save()

    roundRect(ctx, picCenter, 100,  80, 80, 40)
    ctx.drawImage(userImage, picCenter, 100, 80, 80)
    ctx.restore()
    
    ctx.draw()
  },
  saveCanvas() {
    wx.canvasToTempFilePath({
      canvasId: 'canvas',
      quality: 1,
      success(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: (data) => {
            wx.showToast({
              title: '图片成功保存到相册，快去发朋友圈吧！',
              duration: 300,
              success: ()=> {
                wx.navigateTo({
                  url: '/pages/ask/index/index',
                })
              }
            })
          },
          fail: (e) => {
            wx.showToast({
              title: '图片存储失败，请重试！',
              icon: 'fail',
              duration: 300
            })
          }
        })
      }
    })
  }
})