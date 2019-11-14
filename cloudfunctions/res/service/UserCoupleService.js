const {
  minish,
  formatNumber,
  addResultArray,
  requirePass,
  useEffect,
  diffEffectMan,
  diffEffectLady,
  dynamicPrice,
  callName,
  failAttrNames
} = require('../utils/GameUtils.js')
const CommonResponse = require('../utils/CommonResponse.js')
const CoupleDao = require('../dao/CoupleDao.js')


const UserDao = require('../dao/UserDao.js')
const UserManDao = require('../dao/UserManDao.js')
const UserLadyDao = require('../dao/UserLadyDao.js')
const UserCoupleDao = require('../dao/UserCoupleDao.js')
const UserLimitDao = require('../dao/UserLimitDao.js')
const UserCarDao = require('../dao/UserCarDao.js')
const UserHouseDao = require('../dao/UserHouseDao.js')
const UserClothesDao = require('../dao/UserClothesDao.js')
const UserLuxuryDao = require('../dao/UserLuxuryDao.js')


const coupleDao = new CoupleDao()
const userDao = new UserDao()
const userManDao = new UserManDao()
const userLadyDao = new UserLadyDao()
const userCoupleDao = new UserCoupleDao()
const userLimitDao = new UserLimitDao()
const userCarDao = new UserCarDao()
const userHouseDao = new UserHouseDao()
const userClothesDao = new UserClothesDao()
const userLuxuryDao = new UserLuxuryDao()

class UserCoupleService {

  constructor() {}

  async state(ctx, next) {
    const event = ctx._req.event
    let {
      gender
    } = event
    let data = {}
    let result = CommonResponse(-1, 'fail', data)
    let stateObj={}
    
    const coupleList = await coupleDao.getList(gender)
   
    if (coupleList && coupleList.length>0){
      for (let couple of coupleList) {
          let userCouple=await userCoupleDao.getByCoupleId(couple._id)
        if (userCouple){
          let user = await userDao.getByUserId(userCouple._userId)
          if (user){
            stateObj[couple._id] = minish(user)
          }
        }
      }
      data.state = stateObj
    }

    result = CommonResponse(0, 'success', data)
    ctx.body = result
  }

  async relationship(ctx, next) {
    const event = ctx._req.event
    let {
      userId,
      coupleId,
      gender
    } = event
    let data = {}
    let result = CommonResponse(-1, 'fail', data)
    let userObj
    if (gender == 1) {
      userObj = await userManDao.getByUserId(userId)
    } else {
      userObj = await userLadyDao.getByUserId(userId)
    }

    let coupleGet = new Promise((resolve, reject) => {
      const couple = coupleDao.getById(coupleId)
      resolve(couple)
    })

    let coupleRequireGet = new Promise((resolve, reject) => {
      const coupleRequireList = coupleDao.getRequireListByCoupleId(coupleId)
      resolve(coupleRequireList)
    })


    let userCoupleLimitGet = new Promise((resolve, reject) => {
      const coupleLimit = userLimitDao.getCountByUserIdDayAction(userId, userObj.days, 'COUPLE')
      resolve(coupleLimit)
    })


    let userHave1Get, userHave2Get


    if (gender == 1) {
      userHave1Get = new Promise((resolve, reject) => {
        const userCarList = userCarDao.getListByUserId(userId)
        resolve(userCarList)
      })

      userHave2Get = new Promise((resolve, reject) => {
        const userHouseList = userHouseDao.getListByUserId(userId)
        resolve(userHouseList)
      })
    } else {
      userHave1Get = new Promise((resolve, reject) => {
        const userClothesList = userClothesDao.getListByUserId(userId)
        resolve(userClothesList)
      })

      userHave2Get = new Promise((resolve, reject) => {
        const userLuxuryList = userLuxuryDao.getListByUserId(userId)
        resolve(userLuxuryList)
      })
    }


    let coupleGetResult = {},
      coupleRequireResult = [],
      userCoupleLimitResult = {},
      userHave1Result = [],
      userHave2Result = []
    await Promise.all([coupleGet, coupleRequireGet, userCoupleLimitGet, userHave1Get, userHave2Get]).then((results) => {
      coupleGetResult = results[0]
      coupleRequireResult = results[1]
      userCoupleLimitResult = results[2]
      userHave1Result = results[3]
      userHave2Result = results[4]
    }).catch((error) => {
      console.log(error)
    })
    await relationshipProccess(userId,
      coupleId,
      gender, coupleGetResult, coupleRequireResult, userCoupleLimitResult, userHave1Result, userHave2Result, userObj, data)

    result = CommonResponse(0, 'success', data)
    ctx.body = result
  }


}
async function relationshipProccess(userId,
  coupleId,
  gender, coupleGetResult, coupleRequireResult, userCoupleLimitResult, userHave1Result, userHave2Result, userObj, data) {
  let fireValue = 0
  let pass = false
  if (gender == 1) {
    let userCarLevel = 0
    if (userHave1Result && userHave1Result.length > 0) {
      for (let userCar of userHave1Result) {
        userCarLevel += parseInt(userCar.car.level)
      }
    }
    userObj.car = userCarLevel
    let userHouseLevel = 0
    if (userHave2Result && userHave2Result.length > 0) {
      for (let userHouse of userHave2Result) {
        userHouseLevel += parseInt(userHouse.house.level)
      }
    }
    userObj.house = userHouseLevel
  }
  if (coupleRequireResult && coupleRequireResult.length > 0) {
    pass = requirePass(coupleRequireResult, userObj)
    if (pass) {
      for (let coupleRequire of coupleRequireResult) {
        let requireKey = coupleRequire['attrKey'].toLowerCase()
        if (requireKey) {
          let userValue = userObj[requireKey]
          if (userValue) {
            fireValue = parseInt(userValue)
          }
        }
      }
    }
  }
  let coupleLimitData = {}
  if (userCoupleLimitResult == 0) {
    coupleLimitData._userId = userId
    coupleLimitData.action = 'COUPLE'
    coupleLimitData.day = userObj.days
  } else {
    coupleLimitData = false
  }
  let userCoupleMy = await userCoupleDao.getByUserId(userId)
  if (userCoupleMy) {
    let oldUserObj = Object.assign({}, userObj)
    let effectArray = []
    let resultArray = []
    if (gender == 1) {
      let money = userObj['money']
      money = parseInt(money)
      userObj['money'] = money - 5000
      let positive = userObj['positive']
      positive = parseInt(positive)
      userObj['positive'] = positive - 30
      await userManDao.save(userObj, 'update')
      effectArray = diffEffectMan(oldUserObj, userObj)
      addResultArray(resultArray, '啧啧啧！' + callName(gender) + '，到处沾花惹草，吃着碗里的看着锅里的可不好。', false)
    } else {
      let happly = userObj['happly']
      money = parseInt(happly)
      userObj['happly'] = happly - 30
      let popularity = userObj['popularity']
      popularity = parseInt(popularity)
      userObj['popularity'] = popularity - 50
      await userLadyDao.save(userObj, 'update')
      effectArray = diffEffectLady(oldUserObj, userObj)
      addResultArray(resultArray, '啧啧啧！' + callName(gender) + '，红杏出墙会毁掉名声，不作死就不会死。', false)
    }
    if (coupleLimitData) {
      await userLimitDao.save(coupleLimitData, 'add')
    }
    addResultArray(resultArray, '最终:', effectArray)
    data.resultArray = resultArray
  } else {
    let effectArray = []
    let resultArray = []
    if (pass && userCoupleLimitResult == 0) {
      let userCouple = userCoupleDao.getByCoupleId(coupleId)
      if (!userCouple) {
        let userCoupleData = {}
        userCoupleData._userId = userId
        userCoupleData._coupleId = coupleId
        userCoupleData.value = fireValue

        await userCoupleDao.save(userCoupleData, 'add')
        if (coupleLimitData) {
          await userLimitDao.save(coupleLimitData, 'add')
        }
        addResultArray(resultArray, '你们互相欣赏对方，一见钟情，有情人终成眷属！', false)
      } else {
        let user = await userDao.getUserById(userCouple._userId)
        if (user) {
          let currentMaxValue = userCouple.value
          currentMaxValue = parseInt(currentMaxValue)
          let fire = false
          fireValue = 0
          for (let coupleRequire of coupleRequireResult) {
            let requireKey = coupleRequire['attrKey'].toLowerCase()
            if (requireKey) {
              let userValue = userObj[requireKey]
              if (userValue) {
                userValue = parseInt(userValue)
                if (userValue > currentMaxValue) {
                  fireValue = userValue
                  fire = true
                }
              }
            }
          }
          if (fire) {
            let userCoupleFireData = {}
            userCoupleFireData._userId = userId
            userCoupleFireData._coupleId = coupleId
            userCoupleFireData.value = fireValue

            await userCoupleDao.save(userCoupleFireData, 'add')
            await userCoupleDao.deleteById(userCouple._id)
            if (coupleLimitData) {
              await userLimitDao.save(coupleLimitData, 'add')
            }
            addResultArray(resultArray, '你各方面碾压' + user.nickName + ',挖墙脚成功！', false)
          } else {
            if (coupleLimitData) {
              await userLimitDao.save(coupleLimitData, 'add')
            }
            addResultArray(resultArray, '你各方面都不如' + user.nickName + ',去排行版了解下敌情吧！', false)
          }
        }
      }
    } else {
      if (userCoupleLimitResult == 1) {
        addResultArray(resultArray, '先努力成为更好的自己，死缠烂打只会招人烦！', false)
      } else {
        if (coupleLimitData) {
          await userLimitDao.save(coupleLimitData, 'add')
        }
        let failAttrName = []
        failAttrName = failAttrNames(coupleRequireResult, userObj, gender)
        addResultArray(resultArray, '你激动地介绍自己，可对方并没看上你，还是先成为更好的自己吧！', false)
        addResultArray(resultArray, '要求:', failAttrName)
      }
    }
    data.resultArray = resultArray
  }
}


module.exports = UserCoupleService