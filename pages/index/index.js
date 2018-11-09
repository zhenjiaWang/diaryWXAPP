//index.js
//获取应用实例
const { wxGet, wxPost, parseUserState, isEnableBtn} = require('../../utils/common.js')
import biz from '../../biz/biz.js'
import {EventStack} from '../../utils/EventStack.js'
import { Voice } from '../../utils/Voice.js'
const { setWatcher } = require("../../utils/watcher.js");
const app = getApp()

var voice=false
const eventStack = new EventStack()

const options={
  data: {
    attrList: [],
    userState: false,
    userData:false,
    hasUserInfo: false,
    hasLogin:false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onShow:function(){
    console.info('111')
    this.setData({
      hasUserInfo:false,
      submitFlag: false
    })
  },
  onUnload:function(){
    if (voice){
      voice.destroy()
    }
  },
  voiceContext:function(){
    if (voice) {
      return voice
    }
  },
  getEventStack:function(){
    return eventStack
  },
  onLoad: function () {
   const that=this
   setWatcher(that)
   that.setData({
     userData: app.globalData.userData,
     hasAuth:app.globalData.hasAuth
   })
   voice = new Voice() 

    if (app.globalData.userData) {
      this.setData({
        userData: app.globalData.userData,
        //hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userData: res.userInfo,
          //hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userData = res.userInfo
          that.setData({
            userData: res.userInfo,
            //hasUserInfo: true
          })
        }
      })
    }
  },
  gameStart: function (e){
    if(!e.detail.userInfo){
      wx.reLaunch({
        url: '../index/index?authReject=true'
      })
      return
    }
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
      if (!this.data.hasLogin) {
        app.appLogin().then(() => {
          if (app.globalData.userData.userId) {
            that.setData({
              userData: app.globalData.userData,
              hasLogin:true,
              submitFlag: false
            })
            that.start()
            that.resData()
          }
        })
      } else {
        that.setData({
          submitFlag: false
        })
        that.start()
        that.resData()
      }
    }
  },
  resData: function () {
    const that = this
    wxGet('/user/resData/' + that.data.userData.userId,
      false,
      ({ data }) => {
      //  console.info(data)
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
            tipItems:data.tipArray,
            fundItems: data.fundArray
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
    if (that.data.userState.hour >0 && that.data.submitFlag) {
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
              that.getEventStack().init()
             // that.getEventStack().push({ category: 'random' })
              that.voiceContext().playResult()
              that.setData({ submitFlag: false, maskShow: true, dialogShow: true, dialogResult: data.resultArray })
            })
          }
          console.info(data)
        }
      )
    }
  },
  done: function () {
    const that = this
    if (that.data.userState.days == 0&&that.data.userState.hour == 0 && that.data.submitFlag) {
      return false
    } else {
      that.voiceContext().playClick()
      // that.setData({ submitFlag: true, maskShow: true })
      that.setData({ submitFlag: true })
      if (that.data.userState.score > 0 && that.data.userState.comment!==''){
        //这里有值了 直接跳转
        wx.navigateTo({
          url: './report',
        })
      }else{
        wxPost(
          '/user/done',
          {
            userId: that.data.userData.userId
          },
          ({ data }) => {
            if (data.errorCode >= 0) {
              that.voiceContext().playNextDay()
              that.blackScreen('show', '完...', function () {
                that.setData({ maskShow: false })
              }, function () {
                that.setData({ submitFlag: false, maskShow: false })
              })
            }
            console.info(data)
          }
        )
      }
      
    }
  },
  viewRankingList:()=>{
    wx.navigateTo({
      url: './rankingList',
    })
  },
  viewReport:()=>{
    wx.navigateTo({
      url: './report',
    })
  }
}

Object.assign(options,biz)

Page(options)
