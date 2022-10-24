import { strict as assert } from 'assert'
import TodoDB from '../db/todo.db'
import Logger from '../lib/Zlog'

const log = new Logger()

class TodoServiceError extends Error {}

export default class TodoService {
  async createTodoItem(userId, { name, description }) {
    log.debug('Create todo item service')

    assert(userId, new TodoServiceError('userId is required'))
    assert(name, new TodoServiceError('name is required'))
    assert(description, new TodoServiceError('description is required'))

    const todoDb = new TodoDB()
    const id = await todoDb.createTodoItem(userId, { name, description })

    return id
  }// - createTodoItem

  async getTodosByUserId( userId , { page = 1, pageSize = 10 } = {}) {
    assert(userId, new TodoServiceError('userId is required'))

    const todoDb = new TodoDB()
    const data = await todoDb.getTodosByUserId(userId, null, { page, pageSize })

    return {
      pageInfo: data.pageInfo,
      todoItems: data.todoItems
    }
  }// - getTodosByUserId

  async getTodoItemByUserId(userId, todoId) {
    assert(userId, new TodoServiceError('userId is required'))
    assert(todoId, new TodoServiceError('todoId is required'))

    const todoDb = new TodoDB()
    let result = {}
    try {
      const data = await todoDb.getTodosByUserId(userId, todoId)

      if (data && Array.isArray(data.todoItems) && data.todoItems.length) {
        result = data.todoItems[0]
      }
    } catch (e) {
      throw new TodoServiceError('Todo item not found')
    }

    return result
  }// - getTodoItemByUserId

  async updateTodoItem(userId, todoId, { name, description } = {}) {
    assert(userId, new TodoServiceError('userId is required'))
    assert(todoId, new TodoServiceError('todoId is required'))

    const todoDb = new TodoDB()
    let todoItem = null
    try {
      await todoDb.updateTodoItem(userId, todoId, { name, description })
      todoItem = await this.getTodoItemByUserId(userId, todoId)
    } catch (e) {
      throw new TodoServiceError(e.message)
    }

    return todoItem
  }// - updateTodoItem

  async removeTodoItem(userId, todoId) {
    assert(userId, new TodoServiceError('userId is required'))
    assert(todoId, new TodoServiceError('todoId is required'))

    const todoDb = new TodoDB()
    try {
      await todoDb.removeTodoItem(userId, todoId)
    } catch (e) {
      throw new TodoServiceError(e.message)
    }
  }// - removeTodoItem
}
