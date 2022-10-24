import pino from 'pino'
import pretty from 'pino-pretty'
import * as config from './config'

const stream = pretty({
  colorize: true,
})

const LOG_LEVEL = config.string('LOG_LEVEL', 'info')

/**
 * A fancy logger...
 */
export default class Logger {
  #logger

  constructor() {
    this.#logger = pino({ level: LOG_LEVEL }, stream)
    // pino.destination('/tmp')
  }

  debug(...args) {
    this.#logger.debug(args.join(' '))
  }

  info(...args) {
    this.#logger.info(args.join(' '))
  }

  error(...args) {
    this.#logger.error(args.join(' '))
  }
}
