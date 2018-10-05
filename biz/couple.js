export default {
  data: {
    coupleShow: false,
    coupleItems: []
  },
  actionCouple: function () {
  //  this.setData({ coupleShow: true, maskShow: true })
    const that=this
    that.setData({ dialogShow: true })
    // that.setData({nightClass:'show'})
    // setTimeout(function(){
    //   that.setData({ nightText: '过了一夜...' })
    // },1200)
    // setTimeout(function () {
    //   that.setData({ nightClass: 'show hide', nightText: '' })
    // }, 2500)
    // setTimeout(function () {
    //   that.setData({nightClass:'',nightText:'' })
    // }, 3500)
  },
  closeCouple: function () {
    this.setData({ coupleShow: false, maskShow: false })
  }
}