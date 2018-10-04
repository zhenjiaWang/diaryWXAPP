//index.js
//获取应用实例
const { wxGet, wxPost, parseUserState, isEnableBtn} = require('../../utils/common.js')
import biz from '../../biz/biz.js'
const app = getApp()
import { Voice } from '../../utils/Voice.js'    
const voice = new Voice(app.globalData.context1, app.globalData.context2)

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
    voice.regiserListener().bgmRun()
   const that=this
   const userId= wx.getStorageSync("userId")
   const userGender = wx.getStorageSync("gender")
   const userData = app.globalData.userData

   this.setData({ userId, userGender })

   if(userId){
     this.start()
     this.resData()
   } else if (userData){
     that.setData({
       userId: userData.userId,
       userGender: userData.userGender,
       hasUserInfo: true
     })
     that.start()
     that.resData()
   } else{
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
   }
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
            coupleItems: data.coupleArray,
            luckItems: data.luckArray
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
  },
  nextDay:function(){
    const that = this
    if (that.data.userState.hour = 1 && that.data.submitFlag) {
      return false
    } else {
      that.setData({ submitFlag: true,maskShow:true })
      wxPost(
        '/user/nextDay',
        {
          userId: that.data.userId
        },
        ({ data }) => {
          if (data.errorCode >= 0) {
            that.blackScreen('过了一夜...',function(){
              voice.nextDay()
              that.setData({ maskShow: false })
            },function(){
              that.setData({ submitFlag: true,maskShow: true, dialogShow: true, dialogText: data.text })
            })
          }
          console.info(data)
        }
      )
    }
  }
}

Object.assign(options,biz)

Page(options)
