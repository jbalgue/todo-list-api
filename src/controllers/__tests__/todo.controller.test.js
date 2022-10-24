import request from 'supertest'
import app from '../../app'
import UserDB from '../../db/user.db'
import TodoService from '../../services/todo.service'

jest.mock('../../db/user.db')
jest.mock('../../services/todo.service')

describe('ToDo Controller Test', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()

    UserDB.mockImplementation(() => {
      return {
        getUser: () => ({ name: 'Tony Montana', id: '6353a102bbac6fbd2a45ed12' })
      }
    })
  })// - beforeEach

  describe('POST /todo', () => {
    it('should create a todo item successfully', async () => {
      const todoIdMock = 1110

      TodoService.mockImplementation(() => {
        return {
          createTodoItem: () => todoIdMock
        }
      })

      const response = await request(app)
        .post('/todo')
        .set('x-user-id', '63539627732f43902cec430e')
        .send({ name: 'My Todo', description: 'This is a description' })

      expect(response.status).toEqual(200)
      expect(response.body.todoId).toEqual(todoIdMock)
    })

    it('should return bad request on error', async () => {
      TodoService.mockImplementation(() => {
        return {
          createTodoItem: () => {
            throw new Error('Some service error')
          }
        }
      })

      const response = await request(app)
        .post('/todo')
        .set('x-user-id', '63539627732f43902cec430e')
        .send({ name: 'My Todo', description: 'This is a description' })

      expect(response.status).toEqual(400)
      expect(response.body.message).toEqual('Some service error')
    })

    it('should return bad request if required fields are not provided', async () => {
      TodoService.mockImplementation(() => {
        return {
          createTodoItem: () => {
            throw new Error('Some service error')
          }
        }
      })

      const response = await request(app)
        .post('/todo')
        .set('x-user-id', '63539627732f43902cec430e')
        .send({})

      expect(response.status).toEqual(400)
      expect(response.body).toEqual({
        errors: [
          { message: 'name is required', path: 'name' },
          { message: 'description is required', path: 'description' }
        ]
      })
    })
  })// - POST /todo

  describe('GET /todo', () => {
    it('should return todo items successfully', async () => {
      TodoService.mockImplementation(() => {
        return {
          getTodosByUserId: () => ({
            pageInfo: { page: 1,  },
            todoItems: [{ name: 'My todo', id: 'xxxxx' }]
          })
        }
      })

      const response = await request(app)
        .get('/todo')
        .set('x-user-id', '63539627732f43902cec430e')

      expect(response.status).toEqual(200)
      expect(response.body).toMatchObject({
        pageInfo: { page: 1,  },
        items: [{ name: 'My todo', id: 'xxxxx' }]
      })
    })

    it('should return bad request on error', async () => {
      TodoService.mockImplementation(() => {
        return {
          getTodosByUserId: () => {
            throw new Error('Some service error')
          }
        }
      })

      const response = await request(app)
        .get('/todo')
        .set('x-user-id', '63539627732f43902cec430e')

      expect(response.status).toEqual(400)
      expect(response.body.message).toEqual('Some service error')
    })
  })// - GET /todo

  describe('GET /todo/:id', () => {
    it('should return todo details successfully', async () => {
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
      expect(response.body).toMatchObject({
        status: 'ok',
        details: { name: 'My todo', id: 'xxxxx', created: '2022-10-22T13:11:16.880Z' }
      })
    })

    it('should return bad request on error', async () => {
      TodoService.mockImplementation(() => {
        return {
          getTodoItemByUserId: () => {
            throw new Error('Some service error')
          }
        }
      })

      const response = await request(app)
        .get('/todo/6353ebf4fa474ab1f9abaf7f')
        .set('x-user-id', '63539627732f43902cec430e')

      expect(response.status).toEqual(400)
      expect(response.body.message).toEqual('Some service error')
    })
  })// - GET /todo/:id

  describe('PUT /todo/:id', () => {
    it('should return todo details successfully', async () => {
      TodoService.mockImplementation(() => {
        return {
          updateTodoItem: () => ({
            name: 'My todo',
            id: 'xxxxx',
            created: '2022-10-22T13:11:16.880Z',
            lastModified: '2022-10-22T10:43:40.132Z'
          })
        }
      })

      const response = await request(app)
        .put('/todo/6353ebf4fa474ab1f9abaf7f')
        .set('x-user-id', '63539627732f43902cec430e')
        .send({ name: 'Updated name' })

      expect(response.status).toEqual(200)
      expect(response.body).toMatchObject({
        status: 'ok',
        details: { name: 'My todo', id: 'xxxxx', created: '2022-10-22T13:11:16.880Z', lastModified: '2022-10-22T10:43:40.132Z' }
      })
    })

    it('should return bad request on error', async () => {
      TodoService.mockImplementation(() => {
        return {
          updateTodoItem: () => {
            throw new Error('Some service error')
          }
        }
      })

      const response = await request(app)
        .put('/todo/6353ebf4fa474ab1f9abaf7f')
        .set('x-user-id', '63539627732f43902cec430e')
        .send({ name: 'Updated name' })

      expect(response.status).toEqual(400)
      expect(response.body.message).toEqual('Some service error')
    })
  })// - PUT /todo/:id

  describe('DELETE /todo/:id', () => {
    it('should return successfully', async () => {
      TodoService.mockImplementation(() => {
        return {
          removeTodoItem: () => jest.fn()
        }
      })

      const response = await request(app)
        .delete('/todo/6353ebf4fa474ab1f9abaf7f')
        .set('x-user-id', '63539627732f43902cec430e')

      expect(response.status).toEqual(200)
      expect(response.body).toMatchObject({ status: 'ok' })
    })

    it('should return bad request on error', async () => {
      TodoService.mockImplementation(() => {
        return {
          removeTodoItem: () => {
            throw new Error('Some service error')
          }
        }
      })

      const response = await request(app)
        .delete('/todo/6353ebf4fa474ab1f9abaf7f')
        .set('x-user-id', '63539627732f43902cec430e')

      expect(response.status).toEqual(400)
      expect(response.body.message).toEqual('Some service error')
    })
  })// - DELETE /todo/:id
})
