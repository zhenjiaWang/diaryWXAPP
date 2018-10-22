
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
  drawKLine(array,ctx, cvsW, cvsH,{ bottom = 0, topKeep = 5, minRange=10}={}) {
        let maxValue, minValue
    array.forEach(o => {
      const v = o
      maxValue = maxValue < v || !maxValue ? v : maxValue
      minValue = v < minValue || !minValue ? v : minValue
    })
    const itemH = (cvsH - bottom - topKeep - minRange) / (maxValue - minValue)
    const lowestY = itemH * (maxValue - minValue) + topKeep
    const itemW = cvsW / (array.length - 1)

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
}

export  { DrawKLine}