const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const requestApi = (urlparams, requestInfo = {}, option = {}) => {
  const headers = {
    'content-type': requestInfo.header ? requestInfo.header.type : 'application/json'
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: `https://pysapp.com/friend/api/${urlparams}`,
      method: requestInfo.method ? requestInfo.method : 'GET',
      data: requestInfo.data || {},
      headers, 
      responseType: requestInfo.responseType ? requestInfo.responseType : 'text',
      success: function(res) {
        if (requestInfo.responseType == 'arraybuffer') {
          resolve(res.data)
        } else {
          resolve(res.data.data);
        }
      },
      fail: function(e) {
        reject(e);
      }
    })
  })
}
const Login = function(option) {
  let that = this;
  return wx.login({
    success(res) {
      if (res.code) {
        requestApi(`member/auth?authCode=${res.code}`).then(data => {
          wx.setStorageSync('memberId', data);
          getUserInfo(option, data, that);
          debugger
        })
      }
    }
  })
}
const getUserInfo = (option, memberId, that) => {
  // 获取用户信息
  wx.getSetting({
    success: res => {
      if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        wx.getUserInfo({
          success: res => {
            // 可以将 res 发送给后台解码出 unionId
            that.globalData.userInfo = res.userInfo;
            wx.setStorageSync('userInfo', res.userInfo);
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (that.userInfoReadyCallback) {
              that.userInfoReadyCallback(res)
            }
            if (option.shareTicket && memberId != wx.getStorageSync('memberId')) {
              wx.reLaunch({
                url: '/pages/answer/index/index',
              })
            } else {
              wx.reLaunch({
                url: '/pages/ask/index/index',
              })
            };
          }
        })
      } else {
        wx.redirectTo({
          url: '/pages/welcome/index',
        })
      }
    }
  })
}
/**
 * 
 * @param {CanvasContext} ctx canvas上下文
 * @param {number} x 圆角矩形选区的左上角 x坐标
 * @param {number} y 圆角矩形选区的左上角 y坐标
 * @param {number} w 圆角矩形选区的宽度
 * @param {number} h 圆角矩形选区的高度
 * @param {number} r 圆角的半径
 */
function roundRect(ctx, x, y, w, h, r) {
  // 开始绘制
  ctx.beginPath()
  // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
  ctx.setFillStyle('transparent')
  ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)

  // border-top
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.lineTo(x + w, y + r)
  // 右上角
  ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)

  // border-right
  ctx.lineTo(x + w, y + h - r)
  ctx.lineTo(x + w - r, y + h)
  // 右下角
  ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)

  // border-bottom
  ctx.lineTo(x + r, y + h)
  ctx.lineTo(x, y + h - r)
  // 左下角
  ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)

  // border-left
  ctx.lineTo(x, y + r)
  ctx.lineTo(x + r, y)

  // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
  ctx.fill()
  // ctx.stroke()
  ctx.closePath()
  // 剪切
  ctx.clip()
}
// 文字换行
function drawText(ctx, str, leftWidth, initHeight, titleHeight, canvasWidth) {
  var lineWidth = 0;
  var lastSubStrIndex = 0; //每次开始截取的字符串的索引 
  for (let i = 0; i < str.length; i++) {
    lineWidth += ctx.measureText(str[i]).width;
    if (lineWidth > canvasWidth) {
      ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分                
      initHeight += 25; //16为字体的高度                
      lineWidth = 0;
      lastSubStrIndex = i;
      titleHeight += 30;
    }
    if (i == str.length - 1) { //绘制剩余部分                
      ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
    }
  } // 标题border-bottom 线距顶部距离        
  titleHeight = titleHeight + 10;
  return titleHeight
}

module.exports = {
  formatTime: formatTime,
  requestApi: requestApi,
  Login,
  getUserInfo,
  roundRect,
  drawText
}