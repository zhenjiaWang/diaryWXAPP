// pages/index/RankingList.js
const { formatTime } = require('../../utils/util.js') 
const { wxGet, share} = require('../../utils/common.js')
const app = getApp()
Page({
  data: {
    list:[],
    myData: null,
    lastUpdate:'',
    show:false
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '请稍等...',
    })
    this.setData({
      lastUpdate:formatTime(new Date())
    })
    const userId = app.globalData.userId
    const that = this
    wxGet(`/user/rankings/${userId}`, null, ({ data }) => {
      if (data.errorCode >= 0) {
        const { list, myData } = data
        that.setData({
          list,myData
        })
      }
    },null,()=>{
      setTimeout(function () {
        wx.hideLoading()
        that.setData({
          show: true
        })
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