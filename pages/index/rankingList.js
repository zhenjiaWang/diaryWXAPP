// pages/index/RankingList.js
const { formatTime } = require('../../utils/util.js') 
Page({
  data: {
    list:[],
    lastUpdate:''
  },
  onLoad: function (options) {
    this.setData({
      list:[1,2,3,4,1,5,6],
      lastUpdate:formatTime(new Date())
    })
  },
  backHome:function(){
    wx.navigateBack({
      delta:1
    })
  }
})