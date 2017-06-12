const wxLogin = 'https://bala.so/wxapp/login'
const checkLogin = 'https://bala.so/wxapp/loginCheck'

App({
  onLaunch: function () {
    const _this = this
    const user = wx.getStorageSync('user')
    // this.wxLogin();
    // return;
    user ? wx.checkSession({
      success: function (res) {
        _this.globalData.user = user
      },
      fail: function(res) {
        _this.wxLogin()
      }
    }) : _this.wxLogin()
  },
  onShow: function () {
    // console.log('App Show')
  },
  onHide: function () {
    // console.log('App Hide')
  },
  wxLogin: function () {
    const _this = this
    wx.login({
      success: function (res) {
        res.code && wx.request({
          url: wxLogin,
          data: {
            code: res.code
          },
          success: function (res) {
            const userId = res.data && res.data.userId
            // update userInfo on server
            userId && wx.getUserInfo({
              success: function (res) {
                wx.request({
                  url: checkLogin,
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
