var app = getApp()
const uploadFile = require('../../util/util.js').uploadFile

Page({
    data: {},
    uploadImage: function() {
        wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                const paths = res.tempFilePaths
                uploadMore(0)
                function uploadMore(index) {
                    paths[index] && uploadFile(paths[index], uploadMore.bind(null, index + 1))
                    index == paths.length ? wx.previewImage({
                        current: paths[0],
                        urls: paths
                    }) : wx.showToast({
                      title: `The ${index} file upload Ok`,
                    })
                }
            }
        })
    },
    uploadVideo: function() {
        wx.chooseVideo({
            sourceType: ['album', 'camera'],
            maxDuration: 60,
            camera: 'front',
            success: function (res) {
                uploadFile(res.tempFilePath, function (res) {
                    wx.hideToast()
                    wx.showToast({
                        title: JSON.stringify(res)
                    })
                })
            }
        })
    },
    uploadRecord: function() {
        wx.startRecord({
            success: function (res) {
                wx.playVoice({
                    filePath: res.tempFilePath,
                    complete: function () { }
                })
                uploadFile(res.tempFilePath, function (_) {
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
        // 设置录音时长 (s)
        setTimeout(function () {
            wx.stopRecord()
        }, 5000)
    },
    openSocket: function () {
        const user = wx.getStorageSync('user')
        const socketUrl = 'wss://bala.so/wss/wxapp?userId=USERID'
        wx.connectSocket({
            url: socketUrl.replace('USERID', user._id)
        })
        wx.onSocketOpen(function (res) {
            console.log('通道开启')
            let lastSendTime = +new Date
            let counter = 0
            wx.onSocketMessage(function (res) {
                const newTime = +new Date
                console.log('oMessage : ', newTime - lastSendTime, res.data.length / 1024)
                lastSendTime = newTime
                counter++
                wx.sendSocketMessage({
                  data: (counter + '').repeat(3111111),
                  success: function () {
                    const _newTime = +new Date
                    console.log('onSucess : ', _newTime - newTime)
                    counter > 11 && (wx.closeSocket(), console.log('通道关闭'))
                  }
                })
            })
        })
        wx.onSocketError(function (res) {
            console.log('socket connected fail', res)
        })
    },
    getLocation: function() {
        wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                wx.showModal({
                    showCancel: false,
                    title: 'POSITION',
                    content: JSON.stringify(res)
                })
            }
        })
    }
});