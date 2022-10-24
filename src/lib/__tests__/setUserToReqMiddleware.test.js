import UserDB from '../../db/user.db'
import request from 'supertest'
import app from '../../app'
import TodoService from '../../services/todo.service'
import UserService from '../../services/user.service'

jest.mock('../../db/user.db')
jest.mock('../../services/todo.service')
jest.mock('../../services/user.service')

describe('Set User To Req Middleware Test', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })// - beforeEach

  it('should proceed to the next chain successfully', async () => {
    UserDB.mockImplementation(() => {
      return {
        getUser: () => ({ name: 'Tony Montana', id: '6353a102bbac6fbd2a45ed12' })
      }
    })

    TodoService.mockImplementation(() => {
      return {
        getTodoItemByUserId: () => ({
          name: 'My todo',
          id: 'xxxxx',
          created: '2022-10-22T13:11:16.880Z',
        })
      }
    })

    const response = await request(app)
      .get('/todo/6353ebf4fa474ab1f9abaf7f')
      .set('x-user-id', '63539627732f43902cec430e')

    expect(response.status).toEqual(200)
  })

  it('should proceed to the next chain if path is excluded', async () => {
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
  })

  it('should return bad request error if no x-user-id is provided', async () => {
    const response = await request(app)
      .get('/todo/6353ebf4fa474ab1f9abaf7f')

    expect(response.status).toEqual(400)
    expect(response.body).toMatchObject({ message: 'Missing header [x-user-id]' })
  })

  it('should return unauthorized error if no user found', async () => {
    UserDB.mockImplementation(() => {
      return {
        getUser: () => {
          throw new Error('No user found')
        }
      }
    })

    const response = await request(app)
      .get('/todo/xxxxx')
      .set('x-user-id', 'some-guessed-id')

    expect(response.status).toEqual(401)
  })
})