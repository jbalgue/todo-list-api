import { strict as assert } from 'assert'
import UserDB from '../db/user.db'
import Logger from '../lib/Zlog'

const log = new Logger()

class UserServiceError extends Error {}

export default class UserService {
  /**
   * Create user
   * @param {string} name
   */
  async createUser(name) {
    log.debug('Create user service')

    assert(name, new UserServiceError('Name is required'))

    const userDb = new UserDB()
    const id = await userDb.createUser(name)

    return id
  }
}
