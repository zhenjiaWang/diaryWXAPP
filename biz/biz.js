import job from './job.js'
import plan from './plan.js'
import car from './car.js'
import house from './house.js'
import couple from './couple.js'

const { wxGet, parseUserState } = require('../utils/common.js')

const commonData = {
  nightClass:'',
  nightText:'',
  submitFlag: false,
  maskShow: false,
  dialogShow:false,
  dialogText:'',
  dialogBtn:'确 定'
}
function storeMixin(options) {
  let result = {
    data: commonData,
    dialogOK:function(){
      const that=this
      wxGet('/user/refresh/' + that.data.userId,
        false,
        ({ data }) => {
          parseUserState(data, that)
          that.setData({maskShow:false,dialogShow:false})
        })
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

export default storeMixin({ job, plan,car,house,couple })