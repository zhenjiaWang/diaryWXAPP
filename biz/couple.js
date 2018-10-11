const { wxPost, wxGet, isEnableBtn, showMaskNavigationBarColor, closeMaskNavigationBarColor } = require('../utils/common.js')
export default {
  data: {
    myCoupleShow: false,
    coupleShow: false,
    coupleItems: [],
    coupleState:[]
  },
  actionCouple: function () {
    const that = this
    that.voiceContext().playClick()
    wxGet('/couple/state',
      {gender: that.data.userData.userGender},
      ({ data }) => {
        console.info(data)
        if (data.errorCode === 0) {
          showMaskNavigationBarColor()
          that.setData({ coupleShow: true, maskShow: true, coupleState: data.state })
        }
      })
  },
  closeCouple: function () {
    closeMaskNavigationBarColor()
    this.setData({ coupleShow: false, maskShow: false })
    this.voiceContext().playClick()
  },
  showMyCouple: function () {
    showMaskNavigationBarColor()
    this.setData({ myCoupleShow: true, maskShow: true })
    this.voiceContext().playClick()
  },
  closeMyCouple: function () {
    closeMaskNavigationBarColor()
    this.setData({ myCoupleShow: false, maskShow: false })
    this.voiceContext().playClick()
  },
  relationship: function (e) {
    const that = this
    if (that.data.userState.coupleLimit == 1 && that.data.submitFlag) {
      return false
    } else {
      that.voiceContext().playClick()
      that.setData({ submitFlag: true })
      let coupleId = e.currentTarget.dataset.id
      if (coupleId) {
        wxPost(
          '/user/relationship',
          {
            userId: that.data.userData.userId,
            coupleId: coupleId
          },
          ({ data }) => {
            if (data.errorCode >= 0) {
              that.setData({ submitFlag: false, coupleShow: false, dialogShow: true, dialogResult: data.resultArray })
              that.resultVoice(data)
            }
          }
        )
      }
    }
  },
  breakUp:function(e){
    const that = this
    if (that.data.userState.coupleLimit == 1 && that.data.submitFlag) {
      return false
    } else {
      that.voiceContext().playClick()
      that.setData({ submitFlag: true })
      let coupleId = e.currentTarget.dataset.id
      if (coupleId) {
        wxPost(
          '/user/breakUp',
          {
            userId: that.data.userData.userId,
            coupleId: coupleId
          },
          ({ data }) => {
            if (data.errorCode >= 0) {
              that.setData({ submitFlag: false, myCoupleShow: false,coupleShow: false, dialogShow: true, dialogResult: data.resultArray })
              that.resultVoice(data)
            }
          }
        )
      }
    }
  }
}