const { wxPost, isEnableBtn } = require('../utils/common.js')
export default {
  data: {
    planShow: false,
    planItems: []
  },
  actionPlan: function () {
    if (isEnableBtn(this.data.userState.hour, 0)) {
      this.setData({ planShow: true, maskShow: true })
    }
  },
  closePlan: function () {
    this.setData({ planShow: false, maskShow: false })
  },
  applyPlan: function (e) {
    const that = this
    if (that.data.userState.planLimit == 1 && that.data.submitFlag) {
      return false
    } else {
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
            console.info(data)
          }
        )
      }
    }
  }
}