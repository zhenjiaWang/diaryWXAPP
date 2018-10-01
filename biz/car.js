export default {
  data: {
    carShow: false,
    carItems: []
  },
  actionCar: function () {
    this.setData({ carShow: true, maskShow: true })
  },
  closeCar: function () {
    this.setData({ carShow: false, maskShow: false })
  }
}