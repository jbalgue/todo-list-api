import { MongoClient } from 'mongodb'
import Logger from './Zlog'
import * as config from './config'

const log = new Logger()

const url = `${config.string('DATABASE_HOST')}:${config.integer('DATABASE_PORT', 27017)}`
const dbName = config.string('DATABASE_NAME')

let connection = null

async function checkConnection() {
  if (connection) {
    return
  }

  try {
    const client = new MongoClient(url)
    connection = await client.connect()
    log.debug('')
    log.debug('Database connected successfully to server')
    log.debug('')
  } catch (error) {
    log.error('Could not connect - ', error)

    throw error
  }
}

export async function getCollection(collectionName) {
  await checkConnection()
  return connection.db(dbName).collection(collectionName)
}
