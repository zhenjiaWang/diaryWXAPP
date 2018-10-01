export default {
  data: {
    houseShow: false,
    houseItems: []
  },
  actionHouse: function () {
    this.setData({ houseShow: true, maskShow: true })
  },
  closeHouse: function () {
    this.setData({ houseShow: false, maskShow: false })
  }
}