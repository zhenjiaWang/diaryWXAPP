const host ='https://img.jinrongzhushou.com/audio'
const bgm = `${host}/zhangsheng.mp3`
const result = `${host}/result.mp3`
const nextDay = `${host}/gongji.mp3`
const click = `${host}/click.mp3`
const lose = `${host}/wuya.mp3`

 class Voice{
  

    constructor(context1,context2) {
      this.context = context1
      this.bgmContext = context2
      this.bgmContext.loop = true
      this.bgmContext.src = bgm
   }

    nextDay=()=>{
      this.context.src = nextDay
      this.context.play()
    }
    clickBtn=()=>{
      this.context.src = click
      this.context.play()
    }
    lose=()=>{
      this.context.src = lose
      this.context.play()
    }
    result=()=>{
      this.context.src = result
      this.context.play()
    }

    bgmRun(){
      this.bgmContext.play()
    }

    _bgmPause(){
      this.bgmContext.pause()
    }


   regiserListener(){//once only
    
      // context  play  start 
     this.context.offPlay()
     this.context.onPlay(()=>{
       this._bgmPause()
     })
    //context play end 
     this.context.offEnded()
     this.context.onEnded( ()=>{
       setTimeout(()=>{
         this.bgmRun()
       },1000)
     })
     return this
   }

   uber=()=>{
    return this.context
  } 
}
export { Voice }
