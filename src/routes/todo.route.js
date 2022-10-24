import express from 'express'
import TodoController from '../controllers/todo.controller'

const router = express.Router()

const todoController = new TodoController()

router.post('/', todoController.createTodoItem)
  .get('/', todoController.getTodosByUserId) // Get all todo
  .route('/:id')
  .get(todoController.getTodoItemByUserId)// Get todo item
  .put(todoController.updateTodoItem)// Update todo item
  .delete(todoController.removeTodoItem)// Delete todo item

export default router
