import { BadRequest, Unauthorized } from 'http-errors'
import UserDB from '../db/user.db'
import Logger from './Zlog'

const log = new Logger()

/**
 * Basically, a middleware that sets the user details in the request object for other route to use.
 * @param {ClientRequest} req
 * @param {ServerResponse} res
 * @param {*} next
 */
const setUserToReqMiddleware = async (req, res, next) => {
  log.debug('')
  log.debug('setUserToReqMiddleware')
  log.debug('')

  // Excluded
  if (req.path.includes('/user') && req.method === 'POST') {
    return next()
  }

  const userId = req.headers['x-user-id']
  log.debug('userId ->', userId)

  if (!userId) {
    const err = new BadRequest()

    res
      .status(err.statusCode)
      .send({ message: 'Missing header [x-user-id]' })

    return next(err)
  }

  // Inject user details
  const udb = new UserDB()
  let userDetails = null
  try {
    userDetails = await udb.getUser(userId)
    log.debug('userDetails -> ', userDetails)

    if (!userDetails) throw new Error('Invalid user')
  } catch (e) {
    const err = new Unauthorized()

    res
      .status(err.statusCode)
      .send({ message: e.message })

    return next(e)
  }
  req.user = userDetails

  // Housekeeping
  delete req.headers['x-user-id']

  return next()
}

export default setUserToReqMiddleware
