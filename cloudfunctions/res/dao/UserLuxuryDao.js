const cloud = require('wx-server-sdk')

class UserLuxuryDao {

  async getListByUserId(userId) {
    const db = cloud.database()
    let data = []
    await db.collection('user_luxury').aggregate().match({
      _userId: userId
    }).lookup({
      from: 'res_luxury',
      localField: '_luxuryId',
      foreignField: '_id',
      as: 'luxury',
    }).end().then(res => {
      if (res.list.length > 0) {
        data = res.list
      } else {
        data = false
      }
    })
    return data
  }

  async save(saveData, persistent) {
    const db = cloud.database()
    let data = {}
    if (persistent === 'add') {
      await db.collection('user_luxury').add({
        data: saveData
      }).then(res => {
        data = res._id
      })
    } else if (persistent === 'update') {
      const id = saveData['_id']
      delete saveData['_id']
      await db.collection('user_luxury').doc(id).update({
        data: saveData
      }).then(res => {
      })
    }
    return data
  }
}
module.exports = UserLuxuryDao