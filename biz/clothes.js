export default {
  data: {
    clothesShow: false,
    clothesItems: []
  },
  actionClothes: function () {
    this.setData({ clothesShow: true, maskShow: true })
  },
  closeClothes: function () {
    this.setData({ clothesShow: false, maskShow: false })
  }
}