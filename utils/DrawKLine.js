
class DrawKLine {
  constructor() {

  }
  /**
   * Math.abs(topKeep-minRange) 差值越小k线波动越大.二者相加=cvs高度,k线表现为直线
   * @param array 文本内容
   * @param cvsW cvs width
   * @param cvsH cvs heigh
   * @param bottom 底部保留高度(空白高度)
   * @param topKeep 顶部保留高度
   * @param minRange 峰谷最小高度
   */
  drawKLine(array,ctx, cvsW, cvsH,{ bottom = 0, topKeep = 5, minRange=10,size=array.length-1}={}) {
        let maxValue, minValue
    array.forEach(o => {
      const v = o
      maxValue = maxValue < v || !maxValue ? v : maxValue
      minValue = v < minValue || !minValue ? v : minValue
    })
    const itemH = (cvsH - bottom - topKeep - minRange) / (maxValue - minValue)
    const lowestY = itemH * (maxValue - minValue) + topKeep
    const itemW = cvsW / 20

    if(topKeep+minRange>cvsH)
      throw new Error('Please keep a blank area.topKeep+minRange should less than cvsHeigh')

   
    array.forEach((o, i) => {
      const v = o
      const next_v = i === array.length - 1 ? v : array[i + 1]
      ctx.beginPath()
      ctx.strokeStyle = "#66a1d9"
      let x = (itemW * i)
      let y = lowestY - (v - minValue) * itemH
      let next_x = (itemW * (i === array.length - 1 ? i : i + 1))
      let next_y = lowestY - (next_v - minValue) * itemH
      ctx.lineJoin="round"
      ctx.moveTo(x, y)
      ctx.lineTo(next_x, next_y)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(next_x, next_y)
      ctx.lineTo(next_x, cvsH - bottom)
      ctx.lineTo(x, cvsH - bottom)
      ctx.fillStyle = "rgba(0, 150, 223, 0.1)"
      ctx.fill()
    })
    ctx.draw()
  }


  clearCanvas(ctx, cvsW, cvsH){
    ctx.clearRect(0, 0, cvsW, cvsH)
  }

  drawNewLine(array, ctx, cvsW, cvsH, { sizeW = 20,sizeH=10, 
    bottom = 10, topKeep = 20, baseNum = 0, arrowPadding = 4}={}){
    ctx.clearRect(0, 0, cvsW, cvsH)
    const itemW = cvsW / (sizeW+2)
    const itemH=(cvsH-bottom-topKeep)/10
    const startY = topKeep
    const baseLineY = parseInt(sizeH / 2) * itemH + topKeep
    //max
    let max
    array.forEach((i)=>{
      let d = Math.abs(baseNum - i)
      max=!max?d:max<d?d:max
    })
    const pointH = (cvsH - bottom - topKeep)/(max*2)

    //draw table
    ctx.strokeStyle = "rgba(215,209,197,.3)"
    for (let i = 2; i <= sizeW+2;i++ ){
      ctx.beginPath()
      ctx.moveTo(itemW*(i - 1), startY)
      ctx.lineTo(itemW*(i - 1), cvsH-bottom)
      ctx.stroke()
    }
    for (let i = 1; i <= sizeH+1;i++){
      ctx.beginPath()
      ctx.moveTo(itemW, (i - 1) * itemH + topKeep) 
      ctx.lineTo((sizeW + 1) * itemW, (i - 1) * itemH + topKeep)
      ctx.stroke()
    }
    ////draw arrow x
    const mid = sizeH / 2 
    ctx.beginPath() 
    ctx.strokeStyle = "#d7d1c5"
    ctx.moveTo(itemW/2, mid * itemH + topKeep)
    ctx.lineTo((sizeW + 1) * itemW, mid * itemH + topKeep)
    ctx.stroke()
    //arrow head
    ctx.beginPath() 
    ctx.moveTo(itemW - 3, topKeep -arrowPadding/2)
    ctx.lineTo(itemW, topKeep - arrowPadding/2 - itemW*0.5)
    ctx.lineTo(itemW + 3, topKeep - arrowPadding/2) 
    ctx.lineTo(itemW, topKeep - arrowPadding/2-itemW*0.75)
    ctx.lineTo(itemW - 3, topKeep - arrowPadding/2) 
    ctx.fill()
    ctx.stroke()

    ctx.beginPath() 
    const arrowHeardX = itemW * (sizeW + 1) + arrowPadding
    ctx.moveTo(arrowHeardX, baseLineY-5)
    ctx.lineTo(itemW * (sizeW + 1) + itemW*0.75, baseLineY)
    ctx.lineTo(arrowHeardX, baseLineY +5)
    ctx.lineTo(itemW * (sizeW + 1) + itemW * 0.5, baseLineY)
    ctx.lineTo(arrowHeardX, baseLineY - 5)
    ctx.fill()
    ctx.stroke()

    //draw arrow y
    ctx.beginPath()
    ctx.strokeStyle = "#170f0d"
    ctx.moveTo(itemW, topKeep-5)
    ctx.lineTo(itemW, (sizeH) * itemH + topKeep)
    ctx.stroke()

    //kline
    array.forEach((o,i)=>{
      const v = o
      const next_v = i === array.length - 1 ? v : array[i + 1]
      ctx.beginPath()
      ctx.strokeStyle = "#c87f79"
      let x = (itemW * (i+1))
      let y = baseLineY - pointH * (v - baseNum)
      let next_x = (itemW * ((i === array.length - 1 ? i : i + 1)+1))
      let next_y = baseLineY - pointH * (next_v - baseNum)
      ctx.moveTo(x, y)
      ctx.lineTo(next_x, next_y)
      ctx.stroke()
    })
    ctx.draw()
  }
}

export  { DrawKLine}