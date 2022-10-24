import app from './src/app'
import Logger from './src/lib/Zlog'
import * as config from './src/lib/config'

const PORT = config.integer('SERVER_PORT')

const log = new Logger()

app.listen(PORT, () => {
  log.info('')
  log.info('')
  log.info(`TODO List app listening on port ${PORT}`)
  log.info('')
  log.info('')
})
