import { strict as assert } from 'assert'
import { getCollection } from '../lib/mdb'
import { ObjectId } from 'mongodb'
import Logger from '../lib/Zlog'

const log = new Logger()

const USER_COLLECTION = 'users'

class UserDBError extends Error {}

export default class UserDB {
  /**
   * Save user name
   * @param {string} name
   * @returns id
   */
  async createUser(name) {
    assert(name, new UserDBError('name is required'))

    const Users = await getCollection(USER_COLLECTION)
    const { insertedId } = await Users.insertOne({ name, created: new Date() })

    return insertedId.toString()
  }

  /**
   * Fetch user by userId
   * @param {string} userId
   * @returns User details
   */
  async getUser(userId) {
    const Users = await getCollection(USER_COLLECTION)
    let user = null
    try {
      [user] = await Users.find({ _id: ObjectId(userId) })
        .project({
          _id: 0,
          id: '$_id', // Alias
          name: 1,
          createdDate: 1
        }).toArray()
    } catch (e) {
      log.info(e)

      throw new UserDBError('No data found')
    }

    return user
  }
}
