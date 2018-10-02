const host = 'https://game.jinrongzhushou.com/v1'
exports.wxRunAsync= (execute) => {
  return new Promise((resolve, reject) => {
    execute(resolve, reject)
  })
}
exports.wxPost = (url, paramData, successCallback, failCallback) => {
  wx.request({
    url: host + url,
    method: 'POST',
    data: paramData,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success(res) {
      successCallback(res)
    },
    fail(res) {
      failCallback(res)
    }
  })
}

exports.wxGet = (url, paramData, successCallback, failCallback) => {
  wx.request({
    url: host + url,
    data: paramData,
    success(res) {
      successCallback(res)
    },
    fail(res) {
      failCallback(res)
    }
  })
}

exports.parseUserState = (data,that) =>{
  console.info(data)
  if (data.errorCode === 0) {
    for (var i = 0; i < data.attrList.length; i++) {
      data.attrList[i]['textArray'] = data.attrList[i]['text'].split('')
      data.attrList[i]['length'] = data.attrList[i]['text'].length
      data.userState[data.attrList[i]['value']] = data.userState[data.attrList[i]['value']].replace(',', 'f')
      data.userState[data.attrList[i]['value'] + 'Array'] = data.userState[data.attrList[i]['value']].split('')
      data.userState[data.attrList[i]['value'] + 'Length'] = data.userState[data.attrList[i]['value']].length
      data.userState[data.attrList[i]['value'] + 'Color'] = ''
      if (data.attrList[i]['value'] === 'money' || data.attrList[i]['value'] === 'profit') {
        data.userState[data.attrList[i]['value'] + 'Color'] = 'm'
      }
      if (data.attrList[i]['value'] === 'happy') {
        data.userState[data.attrList[i]['value'] + 'Color'] = 'red'
      }
    }
    data.userState['daysArray'] = data.userState['days'].split('')
    data.userState['hoursArray'] = data.userState['hours'].split('')
    that.setData({
      attrList: data.attrList,
      userState: data.userState
    })
  }
}

exports.isEnableBtn = (hour, limitCount) =>{
  return (hour === 0 || limitCount === 1) ? false : true
}