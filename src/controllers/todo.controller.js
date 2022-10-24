import { BadRequest } from 'http-errors'
import Logger from '../lib/Zlog'
import TodoService from '../services/todo.service'
import Joi from 'joi'

const log = new Logger()

const createTodoItemSchema = Joi.object({
  name: Joi.string().max(20).required(),
  description: Joi.string().required()
})

export default class TodoController {
  async createTodoItem(req, res, next) {
    log.debug('createTodoItem controller')

    const { user } = req
    const { name, description, tags } = req.body

    // Validation
    try {
      await createTodoItemSchema.validateAsync(req.body, { abortEarly: false, errors: { wrap: { label: '' } } })
    } catch (e) {
      const { details } = e
      // Give a nice error message
      const errors = details.map(d => ({ path: d.path[0], message: d.message }))

      const httpErr = new BadRequest(e.message)
      res
        .status(httpErr.statusCode)
        .send({ errors })

      return next(httpErr)
    }

    // Create todo item
    const todoService = new TodoService()
    let todoId = null
    try {
      todoId = await todoService.createTodoItem(user.id, { name, description })
    } catch (e) {
      const httpErr = new BadRequest(e.message)
      res
        .status(httpErr.statusCode)
        .send(httpErr)

      return next(httpErr)
    }

    res.send({ status: 'ok', todoId })
    return next()
  }// - createTodoItem

  async getTodosByUserId(req, res, next) {
    const { user, query } = req
    const { page, pageSize } = query

    const todoService = new TodoService()
    let todosData = null
    try {
      todosData = await todoService.getTodosByUserId(user.id, { page, pageSize })
    } catch (e) {
      const httpErr = new BadRequest(e.message)
      res
        .status(httpErr.statusCode)
        .send(httpErr)

      return next(httpErr)
    }

    res.send({
      status: 'ok',
      pageInfo: todosData.pageInfo,
      items: todosData.todoItems
    })

    return next()
  }// - getTodosByUserId

  async getTodoItemByUserId(req, res, next) {
    const { user, params } = req
    const { id: todoId } = params

    const todoService = new TodoService()
    let todo = null
    try {
      todo = await todoService.getTodoItemByUserId(user.id, todoId)
    } catch (e) {
      const httpErr = new BadRequest(e.message)
      res
        .status(httpErr.statusCode)
        .send(httpErr)

      return next(httpErr)
    }

    res.send({ status: 'ok', details: todo })
    return next()
  }// - getTodoItemByUserId

  async updateTodoItem(req, res, next) {
    const { user, params, body } = req
    const { id: todoId } = params
    const { name, description } = body

    const todoService = new TodoService()
    let todo = null
    try {
      todo = await todoService.updateTodoItem(user.id, todoId, { name, description })
    } catch (e) {
      const httpErr = new BadRequest(e.message)
      res
        .status(httpErr.statusCode)
        .send(httpErr)

      return next(httpErr)
    }

    res.send({ status: 'ok', details: todo })
    return next()
  }// - updateTodoItem

  async removeTodoItem(req, res, next) {
    const { user, params } = req
    const { id: todoId } = params

    const todoService = new TodoService()
    try {
      await todoService.removeTodoItem(user.id, todoId)
    } catch (e) {
      const httpErr = new BadRequest(e.message)
      res
        .status(httpErr.statusCode)
        .send(httpErr)

      return next(httpErr)
    }

    res.send({ status: 'ok' })
    return next()
  }// - removeTodoItem
}
