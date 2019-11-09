const {
  minish,
  formatNumber,
  addResultArray,
  requirePass
} = require('../utils/GameUtils.js')
const CommonResponse = require('../utils/CommonResponse.js')
const JobDao = require('../dao/JobDao.js')


const UserManDao = require('../dao/UserManDao.js')
const UserLadyDao = require('../dao/UserLadyDao.js')
const UserJobDao = require('../dao/UserJobDao.js')
const UserLimitDao = require('../dao/UserLimitDao.js')


const jobDao = new JobDao()

const userManDao = new UserManDao()
const userLadyDao = new UserLadyDao()
const userJobDao = new UserJobDao()
const userLimitDao = new UserLimitDao()

class CommonService {

  constructor() {}

  async applyJob(ctx, next) {
    const event = ctx._req.event
    let {
      userId,
      jobId,
      gender
    } = event
    let data = {}

    let jobRequireGet = new Promise((resolve, reject) => {
      const jobRequireList = jobDao.getRequireListByJobId(jobId)
      resolve(jobRequireList)
    })

    if (gender == 1) {
      const userMan = await userManDao.getByUserId(userId)

      let userJobLimitGet = new Promise((resolve, reject) => {
        const jobLimit = userLimitDao.getCountByUserIdDayAction(userId, userMan.days, 'JOB')
        resolve(jobLimit)
      })
      await Promise.all([jobRequireGet, userJobLimitGet]).then((results) => {
        const jobRequireGetResult = results[0]
        const userJobLimitGetResult = results[1]
        let pass = requirePass(jobRequireGetResult, userMan)


      }).catch((error) => {
        console.log(error)
      })
    }
    ctx.body = CommonResponse(0, 'success', data)
  }
}
module.exports = CommonService