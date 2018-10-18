//index.js
//获取应用实例
const { wxGet, wxPost, parseUserState, isEnableBtn} = require('../../utils/common.js')
import biz from '../../biz/biz.js'
const app = getApp()
import { Voice } from '../../utils/Voice.js'
var voice=false

const options={
  data: {
    attrList: [],
    userState: false,
    userData:false,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onUnload:function(){
    if (voice){
      voice.desrory()
    }
  },
  voiceContext:function(){
    if (voice) {
      return voice
    }
  },
  onLoad: function () {
   const that=this
   that.setData({
     userData: app.globalData.userData,
     hasAuth:app.globalData.hasAuth
   })

   voice = new Voice()
  

    // setTimeout(()=>{
    //   wxGet('/userEvent/load',
    //     {
    //       userId: that.data.userData.userId,
    //       eventId: '6456797463776231424',
    //     },
    //     ({ data }) => {
    //       console.info(data)
    //     })
    // },2000)
  },
  gameStart: function (e){
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)
    app.globalData.userData = e.detail.userInfo
    const that = this
    if (that.data.submitFlag) {
      return false
    }else{
      that.setData({submitFlag:true })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#000',
        animation: {
          duration: 500,
          timingFunc: 'easeIn'
        }
      })
      that.setData({ nightClass: 'show' })
      app.appLogin().then(() => {
        if (app.globalData.userData.userId) {
          that.setData({
            userData: app.globalData.userData,
            
            submitFlag:false
          })
          that.start()
          that.resData()
        }
      })
    }
  },
  resData: function () {
    const that = this
    wxGet('/user/resData/' + that.data.userData.userId,
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
            luckItems: data.luckArray,
            tipItems:data.tipArray
          })
        }
      })
  },
  start: function () {
    const that = this
    wxPost('/user/start',
      { userId: that.data.userData.userId },
      ({ data }) => {
        parseUserState(data,that)
        setTimeout(function () {
          that.setData({ nightText: data.nightText, hasUserInfo: true })
        }, 1200)
        setTimeout(function () {
          that.setData({ nightClass: 'show hide', nightText: '' })
          wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#2e55af',
            animation: {
              duration: 1000,
              timingFunc: 'easeIn'
            }
          })
        }, 2500)
        setTimeout(function () {
          that.setData({ nightClass: '' })
          if (data.resultArray){
            that.setData({ maskShow: true, dialogShow: true, dialogResult: data.resultArray })
            that.resultVoice(data)
          }
        }, 3500)
      }
    )
  },
  nextDay:function(){
    const that = this
    if (that.data.userState.hour = 1 && that.data.submitFlag) {
      return false
    } else {
      that.voiceContext().playClick()
      that.setData({ submitFlag: true,maskShow:true })
      wxPost(
        '/user/nextDay',
        {
          userId: that.data.userData.userId
        },
        ({ data }) => {
          if (data.errorCode >= 0) {
            that.voiceContext().playNextDay()
            that.blackScreen('show','过了一夜...',function(){
              that.setData({ maskShow: false })
            },function(){
              that.voiceContext().playResult()
              that.setData({ submitFlag: false, maskShow: true, dialogShow: true, dialogResult: data.resultArray })
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
