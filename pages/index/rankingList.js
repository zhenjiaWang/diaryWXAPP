// pages/index/RankingList.js
const { formatTime } = require('../../utils/util.js') 
const { wxGet, share} = require('../../utils/common.js')
const app = getApp()
Page({
  data: {
    list:[],
    myData: null,
    lastUpdate:'',
    show:false,
    activeType:'all',
    ruleShow:false,
    char_lt:'<'
  },
  onLoad: function (options) {
    this.loadRankings(true)
  },
  selected: function (e){
    const that = this
    let activetype = e.currentTarget.dataset.activetype
    that.setData({
      activeType: activetype
    })
    if (activetype!='rule'){
      that.loadRankings()
    }else{
      that.setData({
        show: false,
        ruleShow:true
      })
    }
  },
  loadRankings:function(f){
    const that = this
    let gender=''
    if(that.data.activeType==='man'){
      gender=1
    } else if (that.data.activeType === 'lady') {
      gender = 2
    }
    wx.showLoading({
      title: '请稍等...',
    })
    this.setData({
      show: false,
      ruleShow:false,
      lastUpdate: formatTime(new Date())
    })
    let userId = app.globalData.userId
   
    if (!userId) {
      userId = 86125
    }
    wxGet(`/user/rankings/${userId}`, { 'gender': gender}, ({ data }) => {
      if (data.errorCode >= 0) {
        if (!data.myData){
          data.myData=false
        }
        const { list, myData } = data
        that.setData({
          list, myData
        })
      }
    }, null, () => {
      setTimeout(function () {
        let t=500
        if(f){
          t+=500
        }
        that.setData({
          show: true
        })
        wx.hideLoading()
      }, 500)
    })
  },
  viewMyReport: function (){
    if(this.data.myData.score>0){
      wx.navigateTo({
        url: './report?userId=' + app.globalData.userId,
      })
    }
  },
  viewReport: (e) => {
    let uid = e.currentTarget.dataset.id
    if (uid){
      wx.navigateTo({
        url: './report?userId=' + uid,
      })
    }
  },
  backHome:function(){
    wx.navigateBack({
      delta:1
    })
  },
  onShareAppMessage(opt){
    return{
      title: '推荐这个我正在混的小程序给你，来试试，看你能混出什么样来！',
      path: '/pages/index/index',
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  }
})