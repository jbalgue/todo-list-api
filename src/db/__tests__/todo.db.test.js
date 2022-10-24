import TodoDB from '../todo.db'
import { getCollection } from '../../lib/mdb'

jest.mock('../../lib/mdb')

describe('ToDo DB Test', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  it('should return data successfully when createTodoItem fn is called', async () => {
    getCollection.mockImplementation(() => {
      return {
        insertOne: () => ({ insertedId: '202' })
      }
    })

    const todoDB = new TodoDB()
    const id = await todoDB.createTodoItem('xxx-user-id', { name: 'Throw my burnt printer ', description: 'After throwing, buy a new one' })

    expect(id).toBeTruthy()
    expect(id).toEqual('202')
    expect(getCollection).toHaveBeenCalledTimes(1)
  })// - createTodoItem

  describe('getTodosByUserId()', () => {
    it('should return paginated data successfully when fn is called', async () => {
      getCollection.mockImplementation(() => {
        return {
          countDocuments: () => 11,
          find: jest.fn(() => ({
            project: jest.fn(() => ({
              sort: jest.fn(() => ({
                skip: jest.fn(() => ({
                  limit: jest.fn(() => ({
                    toArray: () => (Array.from({ length: 10 }, () => ({ id: 'xxxxx-yyy-111', name: 'Some todo' })))
                  }))
                }))
              }))
            }))
          }))
        }// - return
      })

      const todoDB = new TodoDB()
      const { pageInfo, todoItems } = await todoDB.getTodosByUserId('6353ebf4fa474ab1f9abaf7f', null, { page: 1, pageSize: 10 })

      expect(pageInfo).toMatchObject({
        page: 1,
        pageSize: 10,
        totalPages: 2,
        totalEntries: 11
      })
      expect(todoItems).toHaveLength(10)
      expect(getCollection).toHaveBeenCalledTimes(1)
    })

    it('should return a specific todo item only', async () => {
      getCollection.mockImplementation(() => {
        return {
          // countDocuments: () => 10,
          find: jest.fn(() => ({
            project: jest.fn(() => ({
              sort: jest.fn(() => ({
                skip: jest.fn(() => ({
                  limit: jest.fn(() => ({
                    toArray: () => (Array.from({ length: 1 }, () => ({ id: 'xxxxx-yyy-111', name: 'Some todo' })))
                  }))
                }))
              }))
            }))
          }))
        }// - return
      })

      const todoDB = new TodoDB()
      const { pageInfo, todoItems } = await todoDB.getTodosByUserId('6353ebf4fa474ab1f9abaf7f', '6353ebf4fa474ab1f9abaf7f')

      expect(todoItems).toHaveLength(1)
      expect(getCollection).toHaveBeenCalledTimes(1)
    })

    it('should handle exception', async () => {
      getCollection.mockImplementation(() => {
        return {
          find: jest.fn(() => {
            throw new Error('Nasty error')
          })
        }// - return
      })

      const todoDB = new TodoDB()
      await expect(todoDB.getTodosByUserId('6353ebf4fa474ab1f9abaf7f', '6353ebf4fa474ab1f9abaf7f')).rejects.toThrow('')
    })

  })// - getTodosByUserId

  describe('updateTodoItem()', () => {
    it('should call fn successfully', async () => {
      getCollection.mockImplementation(() => {
        return {
          updateOne: () => ({ acknowledged: true, modifiedCount: 1 })
        }
      })

      const todoDB = new TodoDB()
      await expect(todoDB.updateTodoItem('6353ebf4fa474ab1f9abaf7f', '6353ebf4fa474ab1f9abaf7f',
        { name: 'Update todo item', description: 'Update desc' }))
        .resolves.not.toBeInstanceOf(Error)
    })

    it('should do nothing if no params are provided', async () => {
      getCollection.mockImplementation(() => {
        return {
          updateOne: () => ({ acknowledged: true, modifiedCount: 1 })
        }
      })

      const todoDB = new TodoDB()
      await expect(todoDB.updateTodoItem('6353ebf4fa474ab1f9abaf7f', '6353ebf4fa474ab1f9abaf7f'))
        .resolves.not.toBeInstanceOf(Error)

      expect(getCollection).not.toHaveBeenCalled()
    })

    it.each([
      {
        description: 'should throw an exception on update error',
        data: {
          updateOneMock: () => {
            throw new Error('Connection error')
          }
        }
      },
      {
        description: 'should throw an exception if update is not successful',
        data: {
          updateOneMock: () => ({ acknowledged: false, modifiedCount: 0 })
        }
      },
    ])('$description', async ({ data }) => {
      getCollection.mockImplementation(() => {
        return {
          updateOne: data.updateOneMock
        }
      })

      const todoDB = new TodoDB()
      await expect(todoDB.updateTodoItem('6353ebf4fa474ab1f9abaf7f', '6353ebf4fa474ab1f9abaf7f',
        { name: 'Update todo item', description: 'Update desc' }))
        .rejects.toThrow('Failed to update')
    })// - it.each
  })// - updateTodoItem

  describe('removeTodoItem()', () => {
    it('should call fn successfully', async () => {
      getCollection.mockImplementation(() => {
        return {
          deleteOne:  () => ({ acknowledged: true })
        }
      })

      const todoDB = new TodoDB()
      await expect(todoDB.removeTodoItem('6353ebf4fa474ab1f9abaf7f', '6353ebf4fa474ab1f9abaf7f'))
        .resolves.not.toBeInstanceOf(Error)
    })

    it.each([
      {
        description: 'should throw an exception on delete error',
        data: {
          deleteOne: () => {
            throw new Error('Connection error')
          }
        }
      },
      {
        description: 'should throw an exception if delete is not successful',
        data: {
          updateOneMock: () => ({ acknowledged: false })
        }
      },
    ])('$description', async ({ data }) => {
      getCollection.mockImplementation(() => {
        return {
          deleteOne: data.updateOneMock
        }
      })

      const todoDB = new TodoDB()
      await expect(todoDB.removeTodoItem('6353ebf4fa474ab1f9abaf7f', '6353ebf4fa474ab1f9abaf7f'))
        .rejects.toThrow('Failed to remove')
    })// - it.each
  })// - removeTodoItem
})

