const key='event_used'
const h_key='event_h'
const { maxEventInDay}=require('../utils/common.js')

class EventStack{
  item = []
  happened=[]
  length=3
  maxTime = maxEventInDay
  limit=0
  latestType=''
  serialTime=0
  

  constructor(){
    this.limit = wx.getStorageSync(key) || 0
    this.happened = wx.getStorageSync(h_key)||''
    this.happened = this.happened.split(',')
  }

  isHappened(eventId){
    if (this.happened.includes(eventId)){
      this.limit--
      wx.setStorage({ key, data: this.limit })
      console.info(' is happened')
      return  true
    }
    this.happened.push(eventId)
    wx.setStorage({
      key: h_key,
      data: this.happened.join(','),
    })
    console.info('EventStack:new event push isHappened')
    return false
  }

  continueOdds=()=>{
    if (this.serialTime) {
      const odds = 100 / Math.pow(2, this.serialTime)
      return odds
    }
    return 50
  }
  pop = () => {
    
    if (this.maxTime > this.limit && this.item.length > 0) {
      wx.setStorage({ key, data: ++this.limit })
      return this.item.pop()
    } else {
      if (!this.item.length){
        console.info(`EventStack:no more event in stack`)
      } else if (this.maxTime < this.limit){
        console.info(`EventStack:too much event in a day more than max time ${maxEventInDay}!`)
      }
    }
  }
  push = (event) => {
    if (this.item.length < 3) {
      this.item.push(event)
      const { category } = event
      if (category !== this.latestType){
        this.latestType = category
        this.serialTime=1
      } else if (category === this.latestType && this.latestType==='random-serial'){
        this.serialTime++
      }
    } else {
      console.info(`EventStack:event size overflow ${this.item.length} !`)
    }
  }
  init=()=>{
    this.clear()
    wx.setStorage({ key, data: this.limit=0})
   // wx.setStorage({ key: h_key,  data: ''})
  }
  clear=()=>{
    this.item=[]
  }
  print=()=>{
    console.info(this.item.join(','))
  }

}
export  {EventStack}