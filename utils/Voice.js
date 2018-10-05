const host = 'https://img.jinrongzhushou.com/audio'
const bgm = `${host}/background.mp3`
const result = `${host}/result.mp3`
const nextDay = `${host}/gongji.mp3`
const click = `${host}/click3.mp3`
const lose = `${host}/wuya.mp3`
const win = `${host}/win.mp3`
const fail = `${host}/fail.mp3`

class Voice {
  constructor() {
    this.context = wx.createInnerAudioContext()
    this.context.volume=0.3
  }
  destroy=()=>{
    this.context.destroy()
  }
  playNextDay = () => {
    this.context.src = nextDay
    this.context.play()
  }
  playClick = () => {
    this.context.src = click
    this.context.play()
  }
  playLose = () => {
    this.context.src = lose
    this.context.play()
  }
  playWin = () => {
    this.context.src = win
    this.context.play()
  }
  playFail = () => {
    this.context.src = fail
    this.context.play()
  }
  playResult = () => {
    this.context.src = result
    this.context.play()
  }
}
export {
  Voice
}