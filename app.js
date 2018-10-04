//app.js
const { wxPost, wxGet, wxRunAsync} = require('./utils/common.js')
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    

    const that = this
    wx.checkSession({
      success: function () {
        const userid = wx.getStorageSync("userId")
        const gender = wx.getStorageSync("gender")

        if (!userid || !(gender===0 || gender===1)) {
          that.getUserId()
          console.info('userId been deleted ,reGetUserId')
        } else {
          that.globalData.userId = userid
          console.info('userId from storage')
        }
      },
      fail: function () {
        that.getUserId()
        console.info(' get userId timeout or be removed')
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userData:null,
    context1: wx.createInnerAudioContext(),
    context2: wx.createInnerAudioContext()
  },
  getUserId(){
    const that=this
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wxPost('/user/login',
          { code: res.code },
          ({ data }) => {
            if (data.errorCode === 0) {
              wx.setStorageSync('userId', data.userData.userId)
              wx.setStorageSync('gender', data.userData.userGender)

              that.globalData.userData = data.userData
            }
           
          },
          ({ data }) => {

          })
      }
    })
  },
  appLogin: function () {
    const that=this
    return wxRunAsync((resolve, reject)=>{
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wxPost('/user/login',
            { code: res.code },
            ({ data }) => {
              if (data.errorCode === 0) {
                wx.setStorageSync('userId', data.userData.userId)
                wx.setStorageSync('gender', data.userData.userGender)

                that.globalData.userData = data.userData
              }
              resolve()
            },
            ({ data }) => {

            })
        }
      })
    })
  }
})