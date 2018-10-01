//index.js
//获取应用实例
const { wxGet, wxPost, parseUserState} = require('../../utils/common.js')
import biz from '../../biz/biz.js'
const app = getApp()

const options={
  data: {
    attrList: [],
    userState: false,
    userId: false,
    userGender: false,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    const that = this
    app.appLogin().then(() => {
      if (app.globalData.userData.userId) {
        that.setData({
          userId: app.globalData.userData.userId,
          userGender: app.globalData.userData.userGender,
          hasUserInfo: true
        })
        that.start()
        that.resData()
      }
    })
  },
  resData: function () {
    const that = this
    wxGet('/user/resData/' + that.data.userId,
      false,
      ({ data }) => {
        console.info(data)
        if (data.errorCode === 0) {
          that.setData({
            planItems: data.planArray,
            jobItems: data.jobArray,
            carItems: data.carArray,
            houseItems: data.houseArray,
            clothesItems: data.clothesArray,
            luxuryItems: data.luxuryArray,
            coupleItems: data.coupleArray
          })
        }
      })
  },
  start: function () {
    const that = this
    wxPost('/user/start',
      { userId: that.data.userId },
      ({ data }) => {
        parseUserState(data,that)
      }
    )
  }
}

Object.assign(options,biz)

Page(options)
