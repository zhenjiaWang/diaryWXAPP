export default {
  data: {
    luxuryShow: false,
    luxuryItems: []
  },
  actionLuxury: function () {
    this.setData({ luxuryShow: true, maskShow: true })
  },
  closeLuxury: function () {
    this.setData({ luxuryShow: false, maskShow: false })
  }
}