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
    this.setData({
      lastUpdate:formatTime(new Date())
    })
    const userId = app.globalData.userId
    const that = this
    wxGet(`/user/rankings/${userId}`, null, ({ data }) => {
      if (data.errorCode >= 0) {
        const { list, myData } = data
        list.forEach((o)=>{
          o['commentImg'] = that.commentImg(o)
        })
        myData['commentImg'] = that.commentImg(myData)
        that.setData({
          list,myData
        })
      }
    })
  },
  commentImg: ({ comment})=>{
    let img=''
    if (comment ==='碌碌无为'){
      img = 'lu.png'
    } else if (comment === '风生水起') {
      img='feng.png'
    } else if(comment === '穷困潦倒'){
      img = 'qiong.png'
    } else if (comment === '混王之王') {
      img = 'hun.png'
    }
    return img
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