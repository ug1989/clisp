const loginUrl = 'https://bala.so/wxapp/login'
const verifyLoginUrl = 'https://bala.so/wxapp/loginCheck'
const uploadFileUrl = 'https://bala.so/wxapp/uploadFile'
const socketUrl = 'wss://bala.so/wss/wxapp?userId=USERID'

const uploadFile = function(filePath, callback) {
  wx.uploadFile({
    url: uploadFileUrl,
    filePath: filePath,
    name: 'file',
    formData: {
      'userId': getApp().globalData.user._id
    },
    success: function (res) {
      var data = res.data
      callback && callback(res)
    },
    fail: function (res) {
      console.log(res)
    }
  })
}
App({
  onLaunch: function () {
    const _this = this
    const user = wx.getStorageSync('user')
    user ? wx.checkSession({
      success: function (res) {
        _this.globalData.user = user
      },
      fail: function(res) {
        _this.wxLogin()
      }
    }) : _this.wxLogin()

    wx.getSetting({
      success(res) {
        console.log(res);
      }
    })
  },
  onShow: function () {

    // test chooseImage
    false && wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
console.log(tempFilePaths.length)
        uploadFile(tempFilePaths[0], uploadMore.bind(null, 1));
        function uploadMore(index) {
console.log(index)
          tempFilePaths[index] && uploadFile(tempFilePaths[index], uploadMore.bind(null, index + 1))
        }
        0 && wx.previewImage({
          current: tempFilePaths[0],
          urls: tempFilePaths
        })
      }
    })

    // test chooseVideo
    false && wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'front',
      success: function (res) {
        uploadFile(res.tempFilePath, function(res) {
          wx.hideToast()
          wx.showToast({
            title: 'OK',
            duration: 2000
          })
        })
      }
    })

		// test location
    false && wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        wx.showModal({
          showCancel: false,
          title: 'POSITION',
          content: JSON.stringify(res)
        })
      }
    })

    // test record
    false && wx.startRecord({
      success: function (res) {
        wx.playVoice({
          filePath: res.tempFilePath,
          complete: function(){}
        })
        uploadFile(res.tempFilePath, function(_) {
          wx.showToast({
            title: JSON.stringify(_),
          })
        })
      },
      fail: function (res) {
        wx.showToast({
          title: 'record fail',
        })
      }
    })
    false && setTimeout(function () {
      wx.stopRecord()
    }, 10000)
    
    // test socket
    const user = wx.getStorageSync('user')
    wx.connectSocket({
      url: socketUrl.replace('USERID', user._id)
    })
    wx.onSocketOpen(function (res) {
      console.log('socket connected')
      let counter = 0;
      wx.onSocketMessage(function (res) {
        const sc = JSON.stringify({ name: 'who are you' }).repeat(1)
        console.log('返回内容：', res.data)
        console.log('\n准备发送：', +new Date + '')
        wx.sendSocketMessage({
          data: sc,
          success: function() {
            console.log('发送成功：', +new Date + '')
            counter++ == 1 && wx.closeSocket()
          }
        })
      })
    })
    wx.onSocketError(function (res) {
      console.log('socket connected fail')
    })
  },
  onHide: function () {
    // console.log('App Hide')
  },
  wxLogin: function () {
    const _this = this
    wx.login({
      success: function (res) {
        res.code && wx.request({
          url: loginUrl,
          data: {
            code: res.code
          },
          success: function (res) {
            const userId = res.data && res.data.userId
            // update userInfo on server
            userId && wx.getUserInfo({
              success: function (res) {
                wx.request({
                  url: verifyLoginUrl,
                  data: {
                    userId: userId,
                    rawData: res.rawData,
                    signature: res.signature
                  },
                  method: 'POST',
                  success: function (res) {
                    if (res.data) {
                      wx.setStorageSync('user', res.data)
                      _this.globalData.user = res.data
                    }
                  }
                })
              }
            })
          }
        })
      },
      fail: function (res) {
        wx.showModal({
          content: "　　获取登录信息失败，部分功能可能受限，重新授权登录可以删除小程序重新打开。",
          showCancel: false,
          confirmText: "确定"
        })
      }
    })
  },
  globalData: {
    hasLogin: false,
    user: null
  }
})
