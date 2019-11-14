const cloud = require('wx-server-sdk')

class UserHouseDao {

  async getListByUserId(userId) {
    const db = cloud.database()
    let data = []
    await db.collection('user_house').aggregate().match({
      _userId: userId
    }).lookup({
      from: 'res_house',
      localField: '_houseId',
      foreignField: '_id',
      as: 'house',
    }).end().then(res => {
      if (res.list.length > 0) {
        data = res.list
      } else {
        data = false
      }
    })
    return data
  }

  async getListByUserIdHouseId(userId, houseId) {
    const db = cloud.database()
    let data = []
    await db.collection('user_house').where({
      _userId: userId,
      _houseId: houseId
    }).get().then(res => {
      if (res.data.length > 0) {
        data = res.data
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
      await db.collection('user_house').add({
        data: saveData
      }).then(res => {
        data = res._id
      })
    } else if (persistent === 'update') {
      const id = saveData['_id']
      delete saveData['_id']
      await db.collection('user_house').doc(id).update({
        data: saveData
      }).then(res => {
      })
    }
    return data
  }

  async deleteById(id) {
    const db = cloud.database()
    let data = {}
    await db.collection('user_house').doc(id).remove().then(res => {
    })
    return data
  }
}
module.exports = UserHouseDao