import job from './job.js'
import plan from './plan.js'
import car from './car.js'
import house from './house.js'
import couple from './couple.js'
import clothes from './clothes.js'
import luxury from './luxury.js'
import luck from './luck.js'


const { wxGet, parseUserState } = require('../utils/common.js')

const commonData = {
  nightClass:'',
  nightText:'',
  submitFlag: false,
  maskShow: false,
  dialogShow:false,
  dialogResult:'',
  dialogBtn:'确 定'
}
function storeMixin(options) {
  let result = {
    data: commonData,
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
      wxGet('/user/refresh/' + that.data.userId,
        false,
        ({ data }) => {
          parseUserState(data, that)
          that.setData({maskShow:false,dialogShow:false})
        })
    },
    blackScreen:function(text,blackCallback,doneCallback){
      const that = this
      that.setData({ nightClass: 'show' })
      setTimeout(function () {
        that.setData({ nightText: text })
        if (blackCallback) {
          blackCallback()
        }
      }, 1200)
      setTimeout(function () {
        that.setData({ nightClass: 'show hide', nightText: '' })
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

export default storeMixin({ job, plan, car, house, couple, clothes, luxury, luck})