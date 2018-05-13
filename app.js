import util from './util/util'

const loginFailInfo = () => util.showMsgModal("获取认证信息失败！重启微信尝试重新认证。");

const supportRichText = wx.canIUse('rich-text');
if (!supportRichText) util.showMsgModal("您的微信版本过低，小程序的部分功能可能无法正常使用，请更新微信。");

App({
  globalData: {},
  onLaunch: function (options) {
    const _this = this
    const user = wx.getStorageSync('user')
    this.globalData.user = user
    this.globalData.options = options
    user ? wx.checkSession({
      success: function (res) {
        _this.joinGroup()
      },
      fail: function (res) {
        _this.wxLogin()
      }
    }) : _this.wxLogin()
  },
  wxLogin: function () {
    const _this = this
    const appInfo = this.globalData
    // 获取wxapp登录凭证，拿到openId创建或更新用户
    wx.login({
      success: function (res) {
        const loginUrl = 'https://bala.so/wxapp/login'
        res.code ? wx.request({
          url: loginUrl,
          data: { code: res.code },
          success: function (res) {
            const { errMsg, data = {} } = res;
            appInfo.user = errMsg == "request:ok" ? data : null
            appInfo.user && wx.setStorageSync('user', appInfo.user)
          }
        }) : loginFailInfo()
      },
      fail: loginFailInfo
    })
  },
  joinGroup: function() {
    const appInfo = this.globalData
    const shareTicket = appInfo.options.shareTicket
    // 获取群分享标示，添加当前用户到改群
    shareTicket && wx.getShareInfo({
      shareTicket: shareTicket,
      success: function(res) {
        const uploadGroupUrl = 'https://bala.so/wxapp/saveGroupInfo'
        res.userId = appInfo.user && appInfo.user.userId
        wx.request({
          url: uploadGroupUrl,
          data: res,
          method: 'POST',
          success: function(res) {
            const openGId = res.data && res.data.openGId
            appInfo.openGId = openGId
            openGId && appInfo.getInfoWithGId && appInfo.getInfoWithGId(openGId)
          }
        })
      }
    })
  },
  onShow: function () {},
  onHide: function () {}
})
