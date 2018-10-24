const { wxGet,wxPost, isEnableBtn, showMaskNavigationBarColor, closeMaskNavigationBarColor } = require('../utils/common.js')
import { DrawKLine } from '../utils/DrawKLine.js'

const show = 'fundShow'
const items = 'fundItems'

export default {
  data: {
    [show]: false,
    [items]: [],
    fundDetailShow:false,
    fundItem:0,
    canvasHeight:null,
    canvasWidth:null,
    fundMoney:null
  },
  watch: {
    [show]: function (n, o) {
      if (!n) {
        //reset scollbar 
        const dateItem = this.data[items]
        this.setData({ [items]: [] })
        this.setData({ [items]: dateItem })
      }
    },
    'fundDetailShow':function(n,o){
      if(!n){
        this.setData({//init
          fundItem: 0
        })
      }else{
        if(n && !this.fundItem){
          this.setData({//init
            fundItem: 0
          })
        }
      }
    }
  },
  actionFund: function () {
    if (this.hangOn) return
    showMaskNavigationBarColor()
    this.setData({ [show]: true, maskShow: true })
    this.voiceContext().playClick()

    const userId = this.data.userData.userId
    wxGet('/user/fund/market',{userId},
      (({data})=>{
        if (data.errorCode >= 0) {
          let array = this.data[items]
          array.forEach(o=>{
            o['increase'] = data[o.id] ? data[o.id]:0
          })
          this.setData({
            [items]:array
          })
        }
      })
    )
  },
  closeFund: function () {
    closeMaskNavigationBarColor()
    this.setData({ [show]: false, maskShow: false })
    this.voiceContext().playClick()
  },
  actionFundDetail:function(e){
    if (this.hangOn) return
    const fundItem=e.currentTarget.dataset.item
    this.setData({ [show]: false, fundDetailShow: true, fundItem})
    this.voiceContext().playClick()
    //
    const userId = this.data.userData.userId
    const fundId=fundItem.id
    var query = wx.createSelectorQuery()
    query.select('#cvsWrap').boundingClientRect()
    const that=this
    
    query.exec(function (res) {
      that.setData({
        canvasHeight: res[0].height,
        canvasWidth: res[0].width
      })
      wxGet('/user/fund/trade', { userId, fundId},
        (({ data }) => {
          if (data.errorCode >= 0) {
            const dl = new DrawKLine()
            const array = data.market['market']
            dl.drawNewLine(array, wx.createCanvasContext('kline'),
            that.data.canvasWidth, that.data.canvasHeight)
            that.setData({
              fundMoney: data.fundMoney
            })
          }
        })
      )
    })
  },
  closeFundDetail:function(){
    closeMaskNavigationBarColor()
    this.setData({ [show]: false, maskShow: false, fundDetailShow:false })
    this.voiceContext().playClick()
  },
  applyFund: function (e) {
    const that = this
    if (that.data.userState.fundLimit == 1 && that.data.submitFlag) {
      return false
    } else {
      that.voiceContext().playClick()
      that.setData({ submitFlag: true })
      let fundId = e.currentTarget.dataset.id
      if (fundId) {
        wxPost(
          '/user/applyFund',
          {
            userId: that.data.userData.userId,
            fundId: fundId
          },
          ({ data }) => {
            if (data.errorCode >= 0) {
              that.getEventStack().push({ category: 'random-fund' })
              that.setData({ submitFlag: false, [show]: false, dialogShow: true, dialogResult: data.resultArray })
              that.resultVoice(data, true)
            }
          }
        )
      }
    }
  }
}
