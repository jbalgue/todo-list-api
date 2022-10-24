import { BadRequest } from 'http-errors'
import UserService from '../services/user.service'

export default class UserController {
  async createUser(req, res, next) {
    const { name } = req.body

    const userService = new UserService()
    let userId = null
    try {
      userId = await userService.createUser(name)
    } catch (e) {
      const httpErr = new BadRequest(e.message)
      res
        .status(httpErr.statusCode)
        .send(httpErr)

      return next(httpErr)
    }

    res.send({ status: 'ok', userId })
    return next()
  }// - createUser
}
