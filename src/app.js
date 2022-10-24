import express from 'express'
import compression from 'compression'
import setUserToReqMiddleware from './lib/setUserToReqMiddleware'
import registreRoutes from './routes'

const app = express()

app.use(express.json())
app.use(compression())
app.use(setUserToReqMiddleware)

registreRoutes(app)

export default app
