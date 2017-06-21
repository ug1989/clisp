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
    user: null
  },
  onLaunch: function (options) {
    const _this = this
    const user = wx.getStorageSync('user')
    this.globalData.user = user
    this.globalData.options = options
    user ? wx.checkSession({
      success: function (res) { },
      fail: function (res) {
        _this.wxLogin()
      }
    }) : _this.wxLogin()
  },
  onShow: function (options) { },
  onHide: function () {},
  wxLogin: function () {
    const _this = this
    // 获取wxapp登录凭证，拿到openId创建或更新用户
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
            _this.globalData.userId = userId
            // 获取用户信息，头像、昵称等
            userId && wx.getUserInfo({
              success: function (res) {
                // 校验用户信息，通过验证hashed信息确认信息来自微信
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
