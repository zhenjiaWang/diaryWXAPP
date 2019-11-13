const {
  minish,
  gameDays,
  formatNumber,
  addResultArray,
  useEffect,
  diffEffectMan,
  diffEffectLady,
  toDecimal, fundMarket
} = require('../utils/GameUtils.js')
const CommonResponse = require('../utils/CommonResponse.js')
const FundDao = require('../dao/FundDao.js')


const UserManDao = require('../dao/UserManDao.js')
const UserLadyDao = require('../dao/UserLadyDao.js')
const UserFundDao = require('../dao/UserFundDao.js')
const UserLimitDao = require('../dao/UserLimitDao.js')


const fundDao = new FundDao()

const userManDao = new UserManDao()
const userLadyDao = new UserLadyDao()
const userFundDao = new UserFundDao()
const userLimitDao = new UserLimitDao()

class UserFundService {

  constructor() { }


  async market(ctx, next) {
    const event = ctx._req.event
    let {
      userId,
      gender
    } = event
    let data = {}
    let result = CommonResponse(-1, 'fail', data)
    let userObj
   

    let userObjGet = new Promise((resolve, reject) => {
      let userObj
      if (gender == 1) {
        userObj =  userManDao.getByUserId(userId)
      } else {
        userObj =  userLadyDao.getByUserId(userId)
      }
      resolve(userObj)
    })

    let fundListGet = new Promise((resolve, reject) => {
      const fundList = fundDao.getList()
      resolve(fundList)
    })

    let userObjResult = {},
      fundListResult = []
    await Promise.all([userObjGet, fundListGet]).then((results) => {
      userObjResult = results[0]
      fundListResult = results[1]
    }).catch((error) => {
      console.log(error)
    })
    await marketProccess(userId,
      gender, fundListResult, userObjResult, data)

    result = CommonResponse(0, 'success', data)
    ctx.body = result
  }
  async trade(ctx, next) {
    const event = ctx._req.event
    let {
      userId,
      gender,
      fundId
    } = event
    let data = {}
    let result = CommonResponse(-1, 'fail', data)
    let userObj


    let fundGet = new Promise((resolve, reject) => {
      const fund = fundDao.getById(fundId)
      resolve(fund)
    })

    let userObjGet = new Promise((resolve, reject) => {
      let userObj
      if (gender == 1) {
        userObj = userManDao.getByUserId(userId)
      } else {
        userObj = userLadyDao.getByUserId(userId)
      }
      resolve(userObj)
    })

    let userFundMarketGet = new Promise((resolve, reject) => {
      const userFundMarket = userFundDao.getMarketByUserFundId(userId,fundId)
      resolve(userFundMarket)
    })

    let userObjResult = {},
      fundResult = {}, userFundMarketResult = {}
    await Promise.all([userObjGet, fundGet, userFundMarketGet]).then((results) => {
      userObjResult = results[0]
      fundResult = results[1]
      userFundMarketResult = results[2]
    }).catch((error) => {
      console.log(error)
    })
    await tradeProccess(userId,
      gender, fundResult, userFundMarketResult,userObjResult, data)

    result = CommonResponse(0, 'success', data)
    ctx.body = result
  }

  
  async buyFund(ctx, next) {
    const event = ctx._req.event
    let {
      userId,
      gender,
      fundId,
      money
    } = event
    let data = {}
    let result = CommonResponse(-1, 'fail', data)



    let fundGet = new Promise((resolve, reject) => {
      const fund = fundDao.getById(fundId)
      resolve(fund)
    })

    let userObj
    if (gender == 1) {
      userObj = await userManDao.getByUserId(userId)
    } else {
      userObj = await userLadyDao.getByUserId(userId)
    }

    let userFundMarketGet = new Promise((resolve, reject) => {
      const userFundMarket = userFundDao.getMarketByUserFundId(userId, fundId)
      resolve(userFundMarket)
    })

    let userFundLimitGet = new Promise((resolve, reject) => {
      const fundLimit = userLimitDao.getCountByUserIdDayAction(userId, userObj.days, 'FUND')
      resolve(fundLimit)
    })


    let  fundResult = {}, userFundMarketResult = {}, userFundLimitGetResult={}
    await Promise.all([fundGet, userFundMarketGet, userFundLimitGet]).then((results) => {
      fundResult = results[0]
      userFundMarketResult = results[1]
      userFundLimitGetResult = results[2]
    }).catch((error) => {
      console.log(error)
    })
    await buyProccess(userId,
      gender, money, fundResult, userFundMarketResult, userFundLimitGetResult, userObj, data)

    result = CommonResponse(0, 'success', data)
    ctx.body = result
  }

  async sellFund(ctx, next) {
    const event = ctx._req.event
    let {
      userId,
      gender,
      fundId,
      money
    } = event
    let data = {}
    let result = CommonResponse(-1, 'fail', data)



    let fundGet = new Promise((resolve, reject) => {
      const fund = fundDao.getById(fundId)
      resolve(fund)
    })

    let userObj
    if (gender == 1) {
      userObj = await userManDao.getByUserId(userId)
    } else {
      userObj = await userLadyDao.getByUserId(userId)
    }

    let userFundMarketGet = new Promise((resolve, reject) => {
      const userFundMarket = userFundDao.getMarketByUserFundId(userId, fundId)
      resolve(userFundMarket)
    })

    let userFundLimitGet = new Promise((resolve, reject) => {
      const fundLimit = userLimitDao.getCountByUserIdDayAction(userId, userObj.days, 'FUND')
      resolve(fundLimit)
    })

    let userFundGet = new Promise((resolve, reject) => {
      const userFund = userFundDao.getByUserFundId(userId, fundId)
      resolve(userFund)
    })

    let fundResult = {}, userFundMarketResult = {}, userFundLimitGetResult = {}, userFundResult = {}
    await Promise.all([fundGet, userFundMarketGet, userFundLimitGet, userFundGet]).then((results) => {
      fundResult = results[0]
      userFundMarketResult = results[1]
      userFundLimitGetResult = results[2]
      userFundResult = results[3]
    }).catch((error) => {
      console.log(error)
    })
    await sellProccess(userId,
      gender, money, fundResult, userFundResult, userFundMarketResult, userFundLimitGetResult, userObj, data)

    result = CommonResponse(0, 'success', data)
    ctx.body = result
  }
}
async function marketProccess(userId,
  gender, fundListResult, userObj, data) {

  let saveAppUserFundMarketList=[]
  let updateAppUserFundMarketList=[]
  if (fundListResult && fundListResult.length>0){
    for (let resFund of fundListResult) {
      let userFundMarket = await userFundDao.getMarketByUserFundId(userId, resFund._id)
      let doubleList=[]
      doubleList.push(resFund.probability)
      doubleList.push(toDecimal(1 - resFund.probability))

     
      let userFundMarketData={}
      userFundMarketData._userId=userId
      userFundMarketData._fundId = resFund._id

      let d = gameDays() - userObj.days
      let sum=7+d
      let marketArray = []
      if (!userFundMarket){
        for (let i = 1; i <= sum; i++) {
          marketArray.push(fundMarket(doubleList, resFund.minNum, resFund.maxNum))
        }
      }else{
        marketArray = JSON.parse(userFundMarket.market)
        if (marketArray.length < sum) {
          let diff = sum - marketArray.length
          for (let i = 1; i <= diff; i++) {
            marketArray.push(fundMarket(doubleList, resFund.minNum, resFund.maxNum))
          }
        }
      }
    
      userFundMarketData.market = JSON.stringify(marketArray)

      let persistent='update'
      if (!userFundMarket){
        persistent='add'
      }else{
        userFundMarketData._id = userFundMarket._id
      }
      await userFundDao.saveMarket(userFundMarketData, persistent)
      data[resFund._id] = marketArray[marketArray.length-1]
    }
  }
}
async function tradeProccess(userId,
  gender, fundResult, userFundMarketGet,userObj, data) {

  let doubleList = []
  doubleList.push(fundResult.probability)
  doubleList.push(toDecimal(1 - fundResult.probability))

  let market = userFundMarketGet.market
  if(market){
    let marketArray = JSON.parse(market)
    let d = gameDays() - userObj.days
    let sum = 7 + d
    if (marketArray.length<sum){
      let diff = sum - marketArray.length
      for (let i = 1; i <= diff; i++) {
        marketArray.push(fundMarket(doubleList, fundResult.minNum, fundResult.maxNum))
      }
      let userFundMarketData={}
      userFundMarketData._id = userFundMarketGet._id
      userFundMarketData.market = JSON.stringify(marketArray)
      await userFundDao.saveMarket(userFundMarketData, 'update')
      market = marketArray
    } else {
      market = JSON.parse(market)
    }
    data.market = market

    let userFund = await userFundDao.getByUserFundId(userId, fundResult._id)
    let fundMoney=0,buyAll=0
    if (userFund){
      fundMoney = userFund.money
      buyAll = userFund.buy
    }
    let diffMoney = fundMoney - buyAll
    data.diffMoney = diffMoney
    data.fundMoney = fundMoney
  }
}

async function buyProccess(userId,
  gender, money, fundResult, userFundMarketResult, userFundLimitGetResult, userObj, data) {

  let day = userObj.days
  let userMoney = userObj.money
  if (userFundLimitGetResult == 0 && userFundMarketResult){
    userMoney = parseInt(userMoney)
    money = parseInt(money)
    if(userMoney>=money){
      let userFund = await userFundDao.getByUserFundId(userId, fundResult._id)
      let persistent='update'
      let userFundData = {}
     
      if(!userFund){
        persistent='add'
        userFundData._userId = userId
        userFundData._fundId = fundResult._id
        userFundData.buy=0
        userFundData.money=0
        userFundData.day = day
      }
      let market = userFundMarketResult.market
      if (market){
        let marketArray = JSON.parse(market)
        if (marketArray&&marketArray.length>0){
          let lastIndex = marketArray[marketArray.length-1]
          if (lastIndex){
            let fundLimitData = {}
            fundLimitData._userId = userId
            fundLimitData.action = 'FUND'
            fundLimitData.day = userObj.days
            userFundData.market = lastIndex
            userFundData.money = (userFundData.money+money)
            userFundData.buy = (userFundData.buy + money)
            userMoney = userMoney-money

            userObj.money=userMoney
            if (gender == 1) {
              await userManDao.save(userObj, 'update')
            } else {
              await userLadyDao.save(userObj, 'update')
            }
            await userFundDao.save(userFundData, persistent)
            await userLimitDao.save(fundLimitData, 'add')
            let resultArray = []
            console.info(fundResult)
            addResultArray(resultArray, '你已经成功买入:' + fundResult.title + '，投资有风险，见好就收，及时止损。', false)
            data.resultArray = resultArray
          }
        }
      }
    }
  }else{
    let resultArray = []
    addResultArray(resultArray, '抱歉，每日只能进行一次理财操作', false)
    data.resultArray = resultArray
  }
}

async function sellProccess(userId,
  gender, money, fundResult, userFundResult, userFundMarketResult, userFundLimitGetResult, userObj, data) {

  let day = userObj.days
  let userMoney = userObj.money
  if (userFundLimitGetResult == 0) {
    userMoney = parseInt(userMoney)
    money = parseInt(money)

    let fundLimitData = {}
    fundLimitData._userId = userId
    fundLimitData.action = 'FUND'
    fundLimitData.day = userObj.days

    let diffMoney = userMoney-money
    userMoney = userMoney + money
    userObj.money = userMoney
    if (diffMoney==0){
      if (gender == 1) {
        await userManDao.save(userObj, 'update')
      } else {
        await userLadyDao.save(userObj, 'update')
      }
      await userFundDao.deleteFundById(userFundResult._id)
      await userFundDao.deleteDetailByUserFundId(userFundResult._id)
      await userFundDao.deleteMarketById(userFundMarketResult._id)
      await userLimitDao.save(fundLimitData, 'add')
    }else{
      let userFundData = {}
      userFundData._id = userFundResult._id
      userFundData.money = diffMoney
      userFundData.buy = (userFundResult.buy-money)
      if (gender == 1) {
        await userManDao.save(userObj, 'update')
      } else {
        await userLadyDao.save(userObj, 'update')
      }
      await userFundDao.save(userFundData,'update')
      await userLimitDao.save(fundLimitData, 'add')
    }
    let resultArray = []
    addResultArray(resultArray, '你已经成功买入:' + fundResult.title + '，投资有风险，见好就收，及时止损。', false)
    data.resultArray = resultArray
  } else {
    let resultArray = []
    addResultArray(resultArray, '抱歉，每日只能进行一次理财操作', false)
    data.resultArray = resultArray
  }
}
module.exports = UserFundService