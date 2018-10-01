const { wxPost } = require('../utils/common.js')
export default {
  data: {
    jobShow: false,
    jobItems: [],
    jobApplyLimit:1
  },
  actionJob: function () {
    this.setData({ jobShow: true, maskShow: true })
  },
  closeJob: function () {
    this.setData({ jobShow: false, maskShow: false })
  },
  applyJob: function (e) {
    const that = this
    if (that.data.jobApplyLimit===0){
      return false
    }else{
      that.setData({ jobApplyLimit: 0 })
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
              that.setData({ jobShow: false, dialogShow: true, dialogText: data.text })
            }
            console.info(data)
          }
        )
      }
    }
  }
}