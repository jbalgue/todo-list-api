import UserService from '../../services/user.service'
import request from 'supertest'
import app from '../../app'

jest.mock('../../services/user.service')

describe('User Controller Test', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })// - beforeEach

  describe('POST /user', () => {
    it('should create a user successfully', async () => {
      const userIdMock = '6353a102bbac6fbd2a45ed12'

      UserService.mockImplementation(() => {
        return {
          createUser: () => userIdMock
        }
      })

      const response = await request(app)
        .post('/user')
        .send({ name: 'Vito Corleone' })

      expect(response.status).toEqual(200)
      expect(response.body.status).toEqual('ok')
      expect(response.body.userId).toEqual(userIdMock)
    })

    it('should return bad request on error', async () => {
      UserService.mockImplementation(() => {
        return {
          createUser: () => {
            throw new Error('Some service error')
          }
        }
      })

      const response = await request(app)
        .post('/user')
        .send({ name: 'Vito Corleone' })

      expect(response.status).toEqual(400)
      expect(response.body.message).toEqual('Some service error')
    })
  })// - POST /user
})