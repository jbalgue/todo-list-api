import userRoutes from './user.route'
import todoRoutes from './todo.route'

export default function registreRoutes(app) {
  app.use('/user', userRoutes)
  app.use('/todo', todoRoutes)
}
