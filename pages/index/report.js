// pages/index/report.js
const app = getApp()
const { setWatcher } = require("../../utils/watcher.js");
import { DrawKLine } from '../../utils/DrawKLine.js'
const { wxGet,wxPost } = require('../../utils/common.js')
const descriptHeight = 500
const abilityHeight = 380
const color1 = '#8fc673'
const color2 = '#f6de4b'
const color3 = '#ed7c7c'
const color4 = '#eb9bf2'
Page({
  data: {
    canvasWidth: 375,
    canvasHeight: 800,
    screenHeight: null,
    userInfo: {},
    canvasSaveimg: '',
    commentImg:null,
    score:'',
    text:[],
    prop:'',
    shareImgShow: false,
    shareImgSrc: '',
    hideButton:false,
    dataDone:false,
    share:false,
    prepareData:null
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '请稍等...',
    })
    let screenHeight
    const totalHeight = abilityHeight + descriptHeight
    wx.getSystemInfo({
      success: function (res) {
        screenHeight = res.windowHeight
      }
    })
    this.setData({ screenHeight })
   
    const userId=wx.getStorageSync('userId')
    const viewId=options.userId
    const share = !!options.share
    
    if (viewId && viewId!==userId){
      this.setData({ hideButton: true, share})
      wxGet('/user/info', { userId: viewId},({data})=>{
        if(data.errorCode===0){
          this.setData({ userInfo: data.userData })
          const { gender, avatarUrl, nickName, lastComment } = data.userData
          this.getImageInfo(avatarUrl, nickName, viewId, lastComment, gender, viewId)
        }
      })
    }else if(userId){//report 
      wxPost('/user/done',{userId},({data})=>{
        if (data.errorCode === 0) {
          this.setData({ userInfo: data.userData })
          const { gender, avatarUrl, nickName } = data.userData
          this.getImageInfo(avatarUrl, nickName, userId, data.comment, gender, viewId)
        }
      })
    }else{
      wx.hideLoading()
      wx.showToast({
        title: '未找到相关用户ID,请重启小程序',
      })
    }
  },
  watch: {
    'userInfo': {
      handler(value) {
       // this.getImageInfo(value.avatarUrl, value.nickName)
      }
    }
  },
  getImageInfo(url, nickName, userId, commentUrl, gender, viewId) {//  图片缓存本地的方法
    console.info('url=' + url)
    console.info('nickName=' + nickName)

    console.info('userId=' + userId)

    console.info('commentUrl=' + commentUrl)

    commentUrl = `../../img/${commentUrl}.png`
    const that = this
    if (url) {
      that.setData({ commentImg: commentUrl })

      const avatar = new Promise((resolve, reject) => {
        wx.getImageInfo({
          src: url,
          success: res => {
            resolve(res)
          },
          fail: error => {
            reject('avatar qrcode fail')
          }
        })
      })
      // const bgImg = new Promise((resolve, reject) => {
      //   wx.getImageInfo({
      //     src: 'https://img.jinrongzhushou.com/common/body-bg.jpg',
      //     success: (res) => {
      //       console.info('get bgImg success')
      //       resolve(res)
      //     },
      //     fail: err => {
      //       reject('get bgImg fail')
      //     }
      //   })
      // })
      // const sloganImg = new Promise((resolve, reject) => {
      //   wx.getImageInfo({
      //     src: 'https://img.jinrongzhushou.com/common/slogan.png',
      //     success: (res) => {
      //       console.info('get sloganImg success')
      //       resolve(res)
      //     },
      //     fail: err => {
      //       reject('get sloganImg fail')
      //     }
      //   })
      // })
      const report = new Promise((resolve, reject) => {
        let reportUrl =''
        if (viewId){
          reportUrl = `/user/report/${userId}`
        }else{
          reportUrl = `/user/myReport/${userId}`
        }
        
        wxGet(reportUrl, null, ({ data }) => {
          if (data.errorCode==0) {
            for (var i = 0; i < data.attrList.length; i++) {
              let v = data.data[data.attrList[i]['value']]
              if (data.attrList[i]['value'] === 'money' || data.attrList[i]['value'] === 'fund') {
                data.data[data.attrList[i]['value'] + 'Color'] = '2'
              } else if (data.attrList[i]['value'] === 'health') {
                if (v < 60) {
                  data.data[data.attrList[i]['value'] + 'Color'] = '3'
                } else {
                  data.data[data.attrList[i]['value'] + 'Color'] = '1'
                }
              } else {
                if (v < 80) {
                  data.data[data.attrList[i]['value'] + 'Color'] = '3'
                } else if (v > 250) {
                  data.data[data.attrList[i]['value'] + 'Color'] = '4'
                } else {
                  data.data[data.attrList[i]['value'] + 'Color'] = '1'
                }
              }
            }
            that.setData({
              score: data.data.score,
              text: data.data.commentText,
              prop: data.data
            })
          }
          resolve(data)
        }, (error) => {
          reject('report get fail')
        })
      })
     
      Promise.all([avatar, report]).then((result) => {
        
        const avatarResult = result[0]
        const reportResult = result[1]
        wx.hideLoading()
        that.setData({
          dataDone: true
        })
        if (avatarResult.errMsg === 'getImageInfo:ok' && reportResult.errorCode >= 0) {
          that.setData({
            prepareData:{
              param1: {
                avatar: avatarResult.path,
                nickName,
                comment: commentUrl
              },
              param2: reportResult.data,
              gender
            }
          })
          //that.draw(, reportResult.data, gender)
        }
      }).catch((error) => {
        console.info(error)
      })
    }
  },
  draw({
    avatar = '../../img/scjg.png',
    qrCodeImg = '../../img/scjg.png',
    comment = '../../img/feng.png',
    point = '23178208',
    nickName = '张三',
    bgImg='',
    sloganImg=''
  } = {}, {
    coupleTitle = '左手',
    happy = '',
    health = '',
    positive = '',
    experience = '',
    houseTitle = [],
    score = '',
    money = '',
    carTitle = [],
    fundMoney = '',
    ability = '',
    jobTitle = '',
    connections = '',
    commentText = [],
    happyColor = '',
    healthColor = '',
    positiveColor = '',
    experienceColor = '',
    moneyColor='',
    abilityColor='',
    connectionsColor='',
    wisdom = '', 
    beauty='',
    popularity = '', 
    wisdomColor = '',
    beautyColor = '',
    popularityColor = '',
    clothesTitle=[],
    luxuryTitle=[]} = {},gender) {
      try{
    let { canvasWidth } = this.data
    const ctx = wx.createCanvasContext('share')
    let usedHeight = 15 //已使用的高度
    const padding = 20// 距左宽度
    const titleWidth = canvasWidth - padding * 2//标题宽度
    const rankWidth = 85//评级宽度
    const rankMargin = 25 //距离point宽度
    const pointFontSize = 25
    const maxTextWidth = titleWidth - 40//desc文本宽度
    let descHeight=50//预留高度,其中margintop=10,剩余为底
    for (let x = 0; x < commentText.length; x++) {
      const h = this.drawText(ctx, commentText[x], 0, 0, 10, maxTextWidth,true)
      descHeight += h
    }
    this.setData({
      canvasHeight: abilityHeight + descHeight + 120 //属性+描述+二维码
    })
    let { canvasHeight } = this.data
    //draw bg
    ctx.drawImage('../../img/body-bg.jpg', 0, 0, canvasWidth, canvasHeight += 15)
    //draw title
    ctx.drawImage('../../img/slogan.png', padding, usedHeight, titleWidth, usedHeight += 100)
    //draw avatar & rank
    usedHeight += 30//头像圆形上方,圆点需要+半径
    ctx.save()
    ctx.beginPath()
    let _r = 32//头像圆半径
    let _d = _r * 2//头像尺寸
    const center = padding + _r
    ctx.arc(center, usedHeight + _r, _r, 0, 2 * Math.PI);
    ctx.clip()
    ctx.setStrokeStyle('#fff')
    ctx.stroke()
    ctx.drawImage(avatar, padding, usedHeight, _d, _d)
    ctx.restore()
    ctx.drawImage(comment, center + 22, usedHeight + _r - 30, rankWidth, 36)
    ctx.setFillStyle('#f6de4b')
    ctx.setFontSize(14)
    ctx.fillText(nickName, center + 40, usedHeight + _r + 20)

    //point
    const starX = center + 22 + rankWidth + rankMargin
    const pointLength = canvasWidth - starX - 40
    ctx.save()
    ctx.beginPath()
    ctx.rect(starX, usedHeight + _r - 15, pointLength, _r + 15)
    ctx.setFontSize(pointFontSize)
    ctx.setFillStyle('#FFFFFF')
    ctx.setTextAlign('right')
    ctx.setFontSize(35)
    ctx.fillText(score, starX + pointLength - 5, usedHeight + _r + pointFontSize - 15)
    ctx.restore()
    ctx.setFontSize(14)
    ctx.setFillStyle('#FFFFFF')
    ctx.fillText('分', starX + pointLength, usedHeight + _r + 10)


    //draw prop
    usedHeight += 20 + _r * 2//头像直径+padding
    const itemPd = 10// 属性间距
    const itemH = 20 //属性高度
    const itemR = 10 //圆角半径
    const tripleW = (canvasWidth - padding * 2 - itemPd * 2) / 3
    const doubleW = (canvasWidth - padding * 2 - itemPd) / 2

    //line 1
    this.roundRect(ctx, padding, usedHeight, doubleW, itemH, itemR, '金 钱', money, moneyColor)
    this.roundRect(ctx, padding + doubleW + itemPd, usedHeight, doubleW, itemH, itemR, '投资财富', fundMoney, moneyColor)

    //line 2
    usedHeight += itemH + 10
    this.roundRect(ctx, padding, usedHeight, tripleW, itemH, itemR, '快 乐', happy, happyColor)
    this.roundRect(ctx, padding + tripleW + itemPd, usedHeight, tripleW, itemH, itemR, '健康', health,healthColor)
    if(gender===1){
      this.roundRect(ctx, padding + tripleW * 2 + itemPd * 2, usedHeight, tripleW, itemH, itemR, '人 脉', connections, connectionsColor)
    }else{
      this.roundRect(ctx, padding + tripleW * 2 + itemPd * 2, usedHeight, tripleW, itemH, itemR, '知名度', popularity, popularityColor)
    }

    //line 3  
    usedHeight += itemH + 10
    if (gender === 1) {
      this.roundRect(ctx, padding, usedHeight, tripleW, itemH, itemR, '社会经验', experience, experienceColor)
      this.roundRect(ctx, padding + tripleW + itemPd, usedHeight, tripleW, itemH, itemR, '正 义', positive, positiveColor)
    } else {
      this.roundRect(ctx, padding, usedHeight, tripleW, itemH, itemR, '智 慧', wisdom, wisdomColor)
      this.roundRect(ctx, padding + tripleW + itemPd, usedHeight, tripleW, itemH, itemR, '美 貌', beauty, beautyColor)
    }
    this.roundRect(ctx, padding + tripleW * 2 + itemPd * 2, usedHeight, tripleW, itemH, itemR, '能力才干', ability,abilityColor)

    //line 4
    usedHeight += itemH + 10
    if (gender === 1) {
      this.roundRect(ctx, padding, usedHeight, doubleW, itemH, itemR, '座 驾', carTitle ? carTitle[0] : '', 2)
      this.roundRect(ctx, padding + doubleW + itemPd, usedHeight, doubleW, itemH, itemR, '房 产', houseTitle ? houseTitle[0] : '', 2)
    } else {
      this.roundRect(ctx, padding, usedHeight, doubleW, itemH, itemR, '衣 品', clothesTitle ? clothesTitle[0] : '', 2)
      this.roundRect(ctx, padding + doubleW + itemPd, usedHeight, doubleW, itemH, itemR, '妆 容', luxuryTitle ? luxuryTitle[0] : '', 2)
    }
   

    //line 5
    usedHeight += itemH + 10
    this.roundRect(ctx, padding, usedHeight, doubleW, itemH, itemR, '伴 侣', coupleTitle,2)
    this.roundRect(ctx, padding + doubleW + itemPd, usedHeight, doubleW, itemH, itemR, '工 作', jobTitle,2)

    //description
    usedHeight += itemH + 10

    const descTop = 18, descBottom = 18

    console.info(padding, usedHeight, titleWidth, descTop)
    ctx.drawImage('../../img/desc-top.png', padding, usedHeight, titleWidth, descTop)
    ctx.drawImage('../../img/desc-mid.png', padding, usedHeight + descTop, titleWidth, descHeight - descTop * 2)
    ctx.drawImage('../../img/desc-bottom.png', padding, usedHeight + descHeight - descTop, titleWidth, descBottom)

    usedHeight += 30

    ctx.setTextAlign('left')
    ctx.setFillStyle('#000')
    for (let x = 0; x < commentText.length; x++) {
      const h = this.drawText(ctx, commentText[x], padding + 20, usedHeight, 10, maxTextWidth)
      usedHeight += h
    }

    //draw qrcode
    ctx.save()
    ctx.beginPath()
    let q_r = 45//二维码圆半径
    let q_d = q_r * 2//二维码尺寸
    const q_center = padding + q_r
    const bottom = canvasHeight - 120

    ctx.arc(q_center, bottom + q_r, q_r, 0, 2 * Math.PI);
    ctx.clip()
    ctx.stroke()
    ctx.drawImage('../../img/hun_qrcode.jpg', padding, bottom, q_d, q_d)
    ctx.restore()

    ctx.setFontSize(16)

    ctx.setFillStyle('#FFFFFF')
    ctx.fillText('长按图片,扫码来挑战', padding + q_d + 15, bottom + 45)
    ctx.fillText('马上开始鬼混吧!', padding + q_d + 15, bottom + 70)

    ctx.draw()
    // wx.hideLoading()
    // this.setData({
    //   dataDone: true
    // })
    } catch (ex) {
      console.info(ex)
    }
  },
  drawText(ctx, str, x, initHeight, titleHeight, canvasWidth,r) {
    var lineWidth = 0
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引
    ctx.setFontSize(12)
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width
      if (lineWidth > canvasWidth) {
        if (!r) {
          ctx.fillText(str.substring(lastSubStrIndex, i), x, initHeight)//
        }
        initHeight += 20//字体的高度
        lineWidth = 0
        lastSubStrIndex = i
        titleHeight += 30;
      }
      if (i == str.length - 1) {//绘制剩余部分
        if (!r) {
          ctx.fillText(str.substring(lastSubStrIndex, i + 1), x, initHeight)
        }
        if (lastSubStrIndex === 0) {
          titleHeight += 10 // titleHeight -initHeight(字体高度)
        }
      }
    }
    titleHeight = titleHeight + 4
    return titleHeight
  },
  roundRect(ctx, x, y, w, h, r, prop, point,colorIndex) {
    ctx.save()
    ctx.beginPath()
    ctx.setFillStyle('rgba(0, 0, 0, 0.4)')
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)
    // border-top
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.lineTo(x + w, y + r)
    // 右上角
    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)
    // border-right
    ctx.lineTo(x + w, y + h - r)
    ctx.lineTo(x + w - r, y + h)
    // 右下角
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)
    // border-bottom
    ctx.lineTo(x + r, y + h)
    ctx.lineTo(x, y + h - r)
    // 左下角
    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)
    // border-left
    ctx.lineTo(x, y + r)
    ctx.lineTo(x + r, y)
    // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
    ctx.fill()
    // ctx.stroke()
    ctx.closePath()
    // 剪切
    ctx.clip()
    ctx.restore()
    ctx.setFillStyle('#fff')
    ctx.setFontSize(12)
    ctx.setTextAlign('left')
    ctx.fillText(prop, x + 10, y + 14)
    let fontColor=''
    if (colorIndex==1){
      fontColor=color1
    }else if (colorIndex == 2) {
      fontColor = color2
    } else if (colorIndex == 3) {
      fontColor = color3
    } else if (colorIndex == 4) {
      fontColor = color4
    }
    ctx.setFillStyle(fontColor)
    ctx.setTextAlign('right')
    ctx.fillText(point, x + w - (r - 5), y + 14)

  },
  onShareAppMessage(opt) {
    const userId = wx.getStorageSync('userId')
    return {
      title: '推荐这个我正在混的小程序给你，来试试，看你能混出什么样来！',
      path: `/pages/index/index?from=shareReport&userId=${userId}`,
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  },
  saveAsImg: function () {
    const that = this
    if (this.data.prepareData) {
      const { param1, param2, gender } = this.data.prepareData
      const userId = wx.getStorageSync('userId')
      wx.showLoading({
        title: '生成长图中...',
      })
      wx.getImageInfo({
        src: `https://game.jinrongzhushou.com/v1/user/QRCode/${userId}`,
        success: (res) => {
          param1.qrCodeImg = res.path
          that.draw(param1, param2, gender)
          setTimeout(()=>{//cvs.draw() 方法有延迟 
            that._save()
          },1000)
        },
        fail: err => {
          wx.hideLoading()
          wx.showToast({
            title: '二维码获取失败'
          })
          setTimeout(() => {
            wx.hideToast()
          }, 2000)
        }
      })
    } else {
      wx.showToast({
        title: '数据不完整'
      })
      setTimeout(() => {
        wx.hideToast()
      }, 2000)
    }
  },
  _save:function(){
    const that=this
    wx.canvasToTempFilePath({
      canvasId: 'share',
      fileType: 'jpg',
      success: function (res) {
        const path = res.tempFilePath
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success(res) {
            wx.hideLoading()
            that.setData({
              shareImgShow: true,
              shareImgSrc: path
            })
          },
          fail() {
            wx.hideLoading()
          }
        })
      }
    })
  },
  backHome: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  closeShow:function(){
    this.setData({
      shareImgShow: false,
      shareImgSrc: ''
    })
  },
  challenge:function(){
    this.backHome()
  },
  rankingList:function(){
    wx.redirectTo({
      url: './rankingList'
    })
  }
})