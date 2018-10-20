class EventStack{
  item = []
  length=3

  constructor(){
    
  }
  pop=()=>{
    return this.item.pop()
  }
  push=(eventId)=>{
    if(this.item.length<3){
      this.item.push(eventId)
    }
  }
  clear=()=>{
    this.item=[]
  }
  print=()=>{
    console.info(this.item.join(','))
  }

}
export  {EventStack}