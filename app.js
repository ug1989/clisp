const loginFailInfo = function() {
  const alertMsg = "　　获取登录信息失败，部分功能可能受限，删除小程序重新进入可更新授权。"
  wx.showModal({
    content: alertMsg,
    showCancel: false,
    confirmText: "确定"
  })
}

App({
  globalData: {
    hasLogin: false,
    user: null
  },
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
  },
  onShow: function () {},
  onHide: function () {},
  wxLogin: function () {
    const _this = this
    wx.login({
      success: function (res) {
        const loginUrl = 'https://bala.so/wxapp/login'
        !res.code ? loginFailInfo() : wx.request({
          url: loginUrl,
          data: {
            code: res.code
          },
          success: function (res) {
            const userId = res.data && res.data.userId
            // update userInfo on server
            userId && wx.getUserInfo({
              success: function (res) {
                const verifyLoginUrl = 'https://bala.so/wxapp/loginCheck'
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
      fail: loginFailInfo
    })
  }
})
