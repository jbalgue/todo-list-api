import { MongoClient } from 'mongodb'
import { getCollection } from '../mdb'

jest.mock('mongodb')

describe('Mongo DB connection Test', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })// - beforeEach

  it('should throw an error when client could not connect for some reason', async () => {
    MongoClient.mockImplementation(() => {
      return {
        connect: () => {
          throw new Error('Could not connect')
        }
      }
    })

    await expect(getCollection('MyCollection')).rejects.toThrow('Could not connect')
  })

  it('should return collection', async () => {
    MongoClient.mockImplementation(() => {
      return {
        connect: () => {
          return {
            db: () => {
              return {
                collection: () => 'MyCollection'
              }
            }
          }
        }
      }
    })
    const MyCollection = await getCollection('MyCollection')
    expect(MyCollection).toEqual('MyCollection')
  })

  it('should return utilize the same connection', async () => {
    MongoClient.mockImplementation(() => {
      return {
        connect: () => {
          return {
            db: () => {
              return {
                collection: () => 'MyCollection'
              }
            }
          }
        }
      }
    })
    const MyCollection = await getCollection('MyCollection')
    const MyCollection2 = await getCollection('MyCollection')

    expect(MyCollection).toEqual('MyCollection')
    expect(MyCollection2).toEqual('MyCollection')
  })
})
