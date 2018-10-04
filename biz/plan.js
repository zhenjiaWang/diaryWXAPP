const { wxPost, isEnableBtn } = require('../utils/common.js')

const app=getApp()
import { Voice } from '../utils/Voice.js'
const voice = new Voice(app.globalData.context1, app.globalData.context2)

export default {
  data: {
    planShow: false,
    planItems: []
  },
  actionPlan: function () {
    this.setData({ planShow: true, maskShow: true })
    voice.clickBtn()
  },
  closePlan: function () {
    this.setData({ planShow: false, maskShow: false })
    voice.clickBtn()
  },
  applyPlan: function (e) {
    const that = this
    if (that.data.userState.planLimit == 1 && that.data.submitFlag) {
      return false
    } else {
      voice.clickBtn()
      that.setData({ submitFlag: true })
      let planId = e.currentTarget.dataset.id
      console.info(planId)
      if (planId) {
        wxPost(
          '/user/applyPlan',
          {
            userId: that.data.userId,
            planId: planId
          },
          ({ data }) => {
            if (data.errorCode >= 0) {
              that.setData({ submitFlag:false,planShow: false, dialogShow: true, dialogText: data.text })
            }
            voice.result()
            console.info(data)
          }
        )
      }
    }
  }
}