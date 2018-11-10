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
  onShow:function(){
    const that = this
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          app.globalData.hasAuth = true
          that.setData({
            hasAuth: app.globalData.hasAuth
          })
        } else {
          app.globalData.hasAuth = false
          that.setData({
            hasAuth: app.globalData.hasAuth
          })
        }
      }
    })
    that.setData({
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
    wx.showLoading({
      title: '请稍等...',
      mask: true
    })
    const that=this
    setWatcher(that)
    if (app.globalData.userData) {
      that.setData({
        userData: app.globalData.userData,
        hasAuth: app.globalData.hasAuth
      })
    } else if (that.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        app.globalData.userData = res.userInfo
        app.globalData.hasAuth = true
        that.setData({
          userData: app.globalData.userData,
          hasAuth: app.globalData.hasAuth
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userData = res.userInfo
          app.globalData.hasAuth = true
          that.setData({
            userData: app.globalData.userData,
            hasAuth: app.globalData.hasAuth
          })
        }
      })
    }
    
    voice = new Voice()
    setTimeout(function () {
      that.setData({
        waitLoading: false
      })
      wx.hideLoading()
    }, 1000)
  },
  gameAuth:function(e){
    const that = this
    if (that.data.submitFlag) {
      return false
    }else{
      that.voiceContext().playClick()
      that.setData({ submitFlag: true })
      if (!e.detail.userInfo) {
        wx.reLaunch({
          url: '../index/index?authReject=true'
        })
        return
      }
      app.globalData.userData = e.detail.userInfo
      app.globalData.hasAuth = true
      wx.showLoading({
        title: '请稍等...',
        mask: true
      })
      setTimeout(function () {
        that.setData({
          userData: app.globalData.userData,
          hasAuth: app.globalData.hasAuth,
          submitFlag: false
        })
        wx.hideLoading()
      }, 1000)
    }
  },
  gameStart: function (e){
    const that = this
    if (that.data.submitFlag) {
      return false
    }else{
      that.voiceContext().playClick()
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
        that.voiceContext().playNextDay()
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
      that.setData({ submitFlag: true})
      wx.navigateTo({
        url: './report',
        complete: () => {
          that.setData({ submitFlag: false })
          wx.hideLoading()
        }
      })
      // if (that.data.userState.score > 0 && that.data.userState.comment !== '') {

      // } else {
      //   wx.showLoading({
      //     title: '请稍等...',
      //     mask: true
      //   })
      //   wxPost(
      //     '/user/done',
      //     {
      //       userId: that.data.userData.userId
      //     },
      //     ({ data }) => {
      //       if (data.errorCode >= 0) {
      //         wx.navigateTo({
      //           url: './report',
      //           complete: () => {
      //             that.setData({ submitFlag: false })
      //             wx.hideLoading()
      //           }
      //         })
      //       }
      //       console.info(data)
      //     }
      //   )
      // }
      
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
