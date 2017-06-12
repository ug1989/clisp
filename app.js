const wxLoginUrl = 'https://bala.so/wxapp/login'

App({
  onLaunch: function () {
    this.wxLogin();
    return;
    const _this = this
    const userId = wx.getStorageSync('userId')
    userId && wx.checkSession({
      success: function (res) {
        _this.globalData.userId = userId
      },
      fail: function(res) {
        _this.wxLogin()
      }
    }) 
    !userId && _this.wxLogin()
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  wxLogin: function () {
    const _this = this
    wx.login({
      success: function (res) {
        res.code && wx.request({
          url: wxLoginUrl,
          data: {
            code: res.code
          },
          success: function (res) {
            const userId = res.data && res.data.userId
            wx.setStorageSync('userId', userId)
            _this.globalData.userId = userId
            wx.getUserInfo({
              withCredentials: true,
              success: function (res) {
                console.log(res)
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
    userId: null
  }
})
