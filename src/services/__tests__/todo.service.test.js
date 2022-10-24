import TodoService from '../todo.service'
import TodoDB from '../../db/todo.db'

jest.mock('../../db/todo.db')

describe('ToDo Service Test', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  it('should return expected result successfully when createTodoItem fn is called', async () => {
    const createTodoItemMock = jest
      .spyOn(TodoDB.prototype, 'createTodoItem')
      .mockImplementation(() => 111)

    const todoService = new TodoService()
    const todoId = await todoService.createTodoItem('xxx-user-id', { name: 'My initial todo', description: 'Some description' })

    expect(todoId).toBeTruthy()
    expect(createTodoItemMock).toHaveBeenCalledTimes(1)
  })// - createTodoItem

  it('should return expected result successfully when getTodosByUserId fn is called', async () => {
    const getTodosByUserIdMock = jest
      .spyOn(TodoDB.prototype, 'getTodosByUserId')
      .mockImplementation(() => ({ pageInfo: { someInfo: 'hello' }, todoItems: [{ name: 'ToDo ABC', id: '123' }] }))

    const todoService = new TodoService()
    const todoObj = await todoService.getTodosByUserId('xxx-user-id', /*{ page: 1, pageSize: 10 }*/)

    expect(todoObj).toBeTruthy()
    expect(todoObj).toHaveProperty('pageInfo')
    expect(todoObj).toHaveProperty('todoItems')
    expect(getTodosByUserIdMock).toHaveBeenCalledTimes(1)
  })// - getTodosByUserId

  describe('getTodoItemByUserId()', () => {
    it('should return expected result successfully when fn is called', async () => {
      const todoItemsMock = [{ name: 'Hey', id: '123', description: 'some desc' }]

      const getTodosByUserIdMock = jest
        .spyOn(TodoDB.prototype, 'getTodosByUserId')
        .mockImplementation(() => ({ pageInfo: { someInfo: 'hello' }, todoItems: todoItemsMock }))

      const todoService = new TodoService()
      const todoItem = await todoService.getTodoItemByUserId('xxx-user-id', 'zzz-todo-id')

      expect(todoItem).toBeTruthy()
      expect(todoItem).toMatchObject(todoItemsMock[0])
      expect(getTodosByUserIdMock).toHaveBeenCalledTimes(1)
    })

    it('should return empty object when no todo item was found', async () => {
      const todoItemsMock = []

      const getTodosByUserIdMock = jest
        .spyOn(TodoDB.prototype, 'getTodosByUserId')
        .mockImplementation(() => ({ pageInfo: { someInfo: 'hello' }, todoItems: todoItemsMock }))

      const todoService = new TodoService()
      const todoItem = await todoService.getTodoItemByUserId('xxx-user-id', 'zzz-todo-id')

      expect(todoItem).toBeTruthy()
      expect(todoItem).toMatchObject({})
      expect(getTodosByUserIdMock).toHaveBeenCalledTimes(1)
    })

    it('should handle exceptions seamlessly when fn is called', async () => {
      TodoDB.mockImplementation(() => {
        return {
          getTodosByUserId: () => { throw new Error('Some nasty error from database') },
        }
      })

      const todoService = new TodoService()

      await expect(todoService.getTodoItemByUserId('xxx-user-id', 'zzz-todo-id')).rejects.toThrow('Todo item not found')
    })

  })// - getTodoItemByUserId

  describe('getTodosByUserId()', () => {
    it('should return expected result successfully when updateTodoItem fn is called', async () => {
      const updatedTodoItemDataMock = [{ name: 'Updated name', id: '123', description: 'Updated desc' }]

      const getTodosByUserIdMock = jest
        .spyOn(TodoDB.prototype, 'getTodosByUserId')
        .mockImplementation(() => ({ pageInfo: { someInfo: 'hello' }, todoItems: updatedTodoItemDataMock }))
      const updateTodoItemMock = jest
        .spyOn(TodoDB.prototype, 'updateTodoItem')
        .mockImplementation(() => ({ pageInfo: { someInfo: 'hello' }, todoItems: updatedTodoItemDataMock }))

      const todoService = new TodoService()
      const updatedTodoItem = await todoService.updateTodoItem('xxx-user-id', 'zzz-todo-id', updatedTodoItemDataMock[0])

      expect(updatedTodoItem).toBeTruthy()
      expect(updatedTodoItem).toMatchObject(updatedTodoItemDataMock[0])
      expect(getTodosByUserIdMock).toHaveBeenCalledTimes(1)
      expect(updateTodoItemMock).toHaveBeenCalledTimes(1)
    })

    it('should handle exceptions seamlessly when updateTodoItem fn is called', async () => {
      TodoDB.mockImplementation(() => {
        return {
          updateTodoItem: () => { throw new Error('Some nasty error from database') },
        }
      })

      const todoService = new TodoService()

      await expect(todoService
        .updateTodoItem('xxx-user-id', 'zzz-todo-id', /*{ name: 'Updated name', id: '123', description: 'Updated desc' }*/))
        .rejects.toThrow('Some nasty error from database')
    })
  })// - getTodosByUserId

  describe('removeTodoItem()', () => {
    it('should return expected result successfully when removeTodoItem fn is called', async () => {
      const removeTodoItemMock = jest
        .spyOn(TodoDB.prototype, 'removeTodoItem')
        .mockImplementation()

      const todoService = new TodoService()
      await todoService.removeTodoItem('xxx-user-id', 'zzz-todo-id')

      expect(removeTodoItemMock).toHaveBeenCalledTimes(1)
    })

    it('should handle database exceptions seamlessly when removeTodoItem fn is called', async () => {
      TodoDB.mockImplementation(() => {
        return {
          removeTodoItem: () => { throw new Error('Some nasty error from database') },
        }
      })

      const todoService = new TodoService()

      await expect(todoService
        .removeTodoItem('xxx-user-id', 'zzz-todo-id'))
        .rejects.toThrow('Some nasty error from database')
    })
  })// - removeTodoItem
})

