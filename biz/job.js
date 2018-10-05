const { wxPost, isEnableBtn } = require('../utils/common.js')
export default {
  data: {
    myJobShow:false,
    jobShow: false,
    jobItems: []
  },
  actionJob: function () {
    this.setData({ jobShow: true, maskShow: true })
    this.voiceContext().playClick()
  },
  closeJob: function () {
    this.setData({ jobShow: false, maskShow: false })
    this.voiceContext().playClick()
  },
  showMyJob:function(){
    this.setData({ myJobShow: true, maskShow: true })
    this.voiceContext().playClick()
  },
  closeMyJob:function(){
    this.setData({ myJobShow: false, maskShow: false })
    this.voiceContext().playClick()
  },
  applyJob: function (e) {
    const that = this
    if (that.data.userState.jobLimit == 1 && that.data.submitFlag){
      return false
    }else{
      that.voiceContext().playClick()
      that.setData({ submitFlag: true })
      let jobId = e.currentTarget.dataset.id
      if(jobId){
        wxPost(
          '/user/applyJob',
          {
            userId:that.data.userId,
            jobId:jobId
          },
          ({ data }) => {
            if(data.errorCode>=0){
              that.setData({ submitFlag: false, jobShow: false, dialogShow: true, dialogResult: data.resultArray })
              that.resultVoice(data)
            }
            console.info(data)
          }
        )
      }
    }
  }
}