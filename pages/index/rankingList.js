// pages/index/RankingList.js
const { formatTime } = require('../../utils/util.js') 
const { wxGet, share} = require('../../utils/common.js')
const app = getApp()
Page({
  data: {
    list:[],
    myData: null,
    lastUpdate:''
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
      wx.hideLoading()
    })
  },
  viewMyReport: () => {
    wx.navigateTo({
      url: './report',
    })
  },
  viewReport: (e) => {
    let userId = e.currentTarget.dataset.id
    if (userId){
      wx.navigateTo({
        url: './report?userId='+userId,
      })
    }
  },
  backHome:function(){
    wx.navigateBack({
      delta:1
    })
  },
  onShareAppMessage(opt){
    share({
      
    })
  }
})