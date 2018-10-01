export default {
  data: {
    coupleShow: false,
    coupleItems: []
  },
  actionCouple: function () {
    this.setData({ coupleShow: true, maskShow: true })
  },
  closeCouple: function () {
    this.setData({ coupleShow: false, maskShow: false })
  }
}