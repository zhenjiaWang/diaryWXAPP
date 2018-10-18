import job from './job.js'
import plan from './plan.js'
import car from './car.js'
import house from './house.js'
import couple from './couple.js'
import clothes from './clothes.js'
import luxury from './luxury.js'
import luck from './luck.js'
import event from './event.js'

const { wxGet, parseUserState, showMaskNavigationBarColor,closeMaskNavigationBarColor } = require('../utils/common.js')

const commonData = {
  nightClass:'',
  nightText:'',
  submitFlag: false,
  maskShow: false,
  dialogShow:false,
  dialogResult:'',
  dialogBtn:'确 定',
  tipShow: false,
  tipItems: [],
  findEventId:'',
  findEventType:''
}
function storeMixin(options) {
  let result = {
    data: commonData,
    closeTip: function () {
      const that = this
      closeMaskNavigationBarColor()
      that.voiceContext().playClick()
      that.setData({ tipShow: false, maskShow: false })
    },
    actionTip: function () {
      const that = this
      showMaskNavigationBarColor()
      that.voiceContext().playClick()
      that.setData({tipShow:true,maskShow:true})
    },
    resultVoice: function (data,luckWin){
      const that = this
      if (data){
        if (data.errorCode == 0) {
          if (luckWin){
            that.voiceContext().playWin()
          }else{
            that.voiceContext().playResult()
          }
        } else if (data.errorCode == 1) {
          that.voiceContext().playFail()
        }
      }
    },
    dialogOK:function(){
      const that=this
      that.voiceContext().playClick()
      wxGet('/user/refresh/' + that.data.userData.userId,
        false,
        ({ data }) => {
          parseUserState(data, that)
          closeMaskNavigationBarColor()
          that.setData({maskShow:false,dialogShow:false})


          wxGet('/user/' + that.data.findEventType +'/findEvent',
           {
             userId:that.data.userData.userId,
             findEventId: that.data.findEventId,
           },
            ({ data }) => {
              console.info(data)
            })
        })
    },
    blackScreen:function(showClass,text,blackCallback,doneCallback){
      const that = this
      const times=showClass==='show'?1000:0
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#000',
        animation: {
          duration: times,
          timingFunc: 'easeIn'
        }
      })
      that.setData({ nightClass: showClass })
      setTimeout(function () {
        that.setData({ nightText: text })
        if (blackCallback) {
          blackCallback()
        }
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
        if (doneCallback){
          doneCallback()
        }
      }, 3500)
    }
  }
  for (let k in options) {
    let value = options[k];
    if (value.data) {
      //result.data[k] = value.data
      Object.assign(result.data, value.data)
      delete value.data
    }
    Object.assign(result, value)
  }
  return result;
}

export default storeMixin({ job, plan, car, house, couple, clothes, luxury, luck, event})