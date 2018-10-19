const { wxPost, isEnableBtn, showMaskNavigationBarColor, closeMaskNavigationBarColor } = require('../utils/common.js')

const show = 'eventShow'
const items = 'eventItems'

export default {
  data: {
    [show]: false,
    [items]: []
  },
  watch: {
    [show]: function (n, o) {
      if (!n) { //reset scollbar 
        const dateItem = this.data[items]
        this.setData({ [items]: [] })
        this.setData({ [items]: dateItem })
      }
    }
  },
  closeEvent: function () {
    closeMaskNavigationBarColor()
    this.setData({ [show]: false, maskShow: false })
    this.voiceContext().playClick()
  }
}