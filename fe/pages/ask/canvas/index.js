// pages/ask/canvas/index.js
import {
  roundRect,
  drawText,
  requestApi,
  base64_encode
} from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isReply: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let scene
    if (options.questionId) {
      scene = `question=${options.question}&questionId=${options.questionId}&askUserId=${options.askUserId}&tag=${options.tag}&answer=${options.answer}&replyContent=${options.replyContent}&user=${options.user}`
      this.setData({
        isReply: true
      })
    } else {
      scene = `question=${options.question}&bankId=${options.bankId}&user=${options.user}&askUserId=${options.askUserId}`
      this.setData({
        isReply: false
      })
    }
    requestApi(`member/getQRCode?page=pages/answer/index/index&scene=${encodeURIComponent(scene)}&`, {
      header: {
        type: 'application/octet-stream'
      },
      responseType: 'arraybuffer'
    }).then((res) => {
      const filePath = `${wx.env.USER_DATA_PATH}/canvas_qrcode.jpeg`
      wx.getFileSystemManager().writeFile({
        filePath,
        data: res, 
        success: (e) => {
          wx.getImageInfo({
            src: filePath,
            success: (res) => {
              this.drawUserInfo(options, res.path)
            }
          }) 
        }
      })
    })

  },
  drawUserInfo(options, qrCode) {
    const userImage = wx.getStorageSync('userInfo').avatarUrl
    wx.getImageInfo({
      src: userImage,
      success: (res) => {
        this.drawCanvas(options.background, options.question, res.path, qrCode, options)
      },
      fail: (e) => {
        wx.showToast({
          title: `${JSON.stringify(e.errMsg)}`,
          icon: 'fail'
        })
        wx.navigateTo({
          url: '/pages/ask/index/index',
        })
      }
    })
  },
  drawCanvas(image, question, userImage, qrCode, others) {
    const ctx = wx.createCanvasContext('canvas');
    const {
      windowWidth,
      windowHeight
    } = wx.getSystemInfoSync()
    const picCenter = windowWidth / 2 - 40
    const textCenter = windowWidth / 2 - 125
    const rectCenter = windowWidth / 2 - 150
    if (image) {
      ctx.drawImage(image, 0, 0, windowWidth, windowHeight - 86)
    } else {
      ctx.setFillStyle('#f2f2f2')
      ctx.fillRect(0, 0, windowWidth, windowHeight - 86)
    }
    ctx.save()

    // 画边框
    ctx.setFillStyle('#fff')
    ctx.fillRect(0, 0, windowWidth, 10)
    ctx.fillRect(0, 0, 10, windowHeight - 86)
    ctx.fillRect(windowWidth - 10, 0, 10, windowHeight - 86)
    ctx.fillRect(0, windowHeight - 86 - 125, windowWidth, 125)
    ctx.save()

    ctx.setFillStyle('#c3c3c3')
    ctx.setFontSize(12)
    ctx.fillText('长按扫一扫即可匿名回复Ta!', 20, windowHeight - 150)
    ctx.save()

    roundRect(ctx, rectCenter, 140, 300, 220, 10)
    ctx.setFillStyle('#fff')
    ctx.fillRect(rectCenter, 140, 300, 220)
    ctx.restore()

    if (!this.data.isReply) {
      ctx.setFillStyle('#000')
      ctx.setFontSize(16)
      drawText(ctx, question, textCenter, 220, 180, windowWidth - (textCenter * 2))
      ctx.save()
    } else {
      //问题
      ctx.setFillStyle('gray')
      ctx.setFontSize(13)
      ctx.fillText(question, rectCenter + 20, 200)

      //关系链
      ctx.setFillStyle('#000')
      ctx.setFontSize(13)
      ctx.fillText(others.tag + ':' + others.answer, rectCenter + 20, 225)
      
      // 画线
      ctx.beginPath()
      ctx.setStrokeStyle('#c3c3c3')
      ctx.moveTo(rectCenter + 10, 240)
      ctx.lineTo(windowWidth - (rectCenter + 10), 240)
      ctx.stroke()
      
      //回复
      ctx.setFillStyle('#000')
      ctx.font = 'normal bold 16px sans-serif'
      drawText(ctx, others.replyContent, textCenter, 265, 180, windowWidth - (textCenter * 2))

      ctx.save()
    }
    

    roundRect(ctx, picCenter, 100, 80, 80, 40)
    ctx.drawImage(userImage, picCenter, 100, 80, 80)
    ctx.restore()

    ctx.drawImage(qrCode, windowWidth - 120, windowHeight - 206, 120, 120)
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
              duration: 500,
              success: () => {
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
              duration: 10000
            })
          }
        })
      }
    })
  }
})