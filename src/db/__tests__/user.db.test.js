import UserDB from '../user.db'
import { getCollection } from '../../lib/mdb'

jest.mock('../../lib/mdb')

describe('User DB Test', () => {
  it('should return data successfully when createUser fn is called', async () => {
    const idMock = '1102xxxx'
    getCollection.mockImplementation(() => {
      return {
        insertOne: () => ({ insertedId: idMock })
      }
    })

    const userDB = new UserDB()
    const id = await userDB.createUser('Tony Montana')

    expect(id).toEqual(idMock)
    expect(getCollection).toHaveBeenCalledTimes(1)
  })

  describe('getUser()', () => {
    it('should get user', async () => {
      getCollection.mockImplementation(() => {
        return {
          find: jest.fn(() => ({
            project: jest.fn(() => ({
              toArray: () => ([{ name: 'Jimi Hendrix', id: 'xxxxxxx1' }])
            }))
          }))
        }
      })

      const userDB = new UserDB()
      const user = await userDB.getUser('6353ebf4fa474ab1f9abaf7f')
      console.log('user ->', user)
      expect(Object.entries(user).length).toBeGreaterThan(0)
    })

    it('should throw exception on error - getUser()', async () => {
      getCollection.mockImplementation(() => {
        return {
          find: () => {
            throw new Error('Some error')
          }
        }
      })

      const userDB = new UserDB()
      await expect(userDB.getUser('6353ebf4fa474ab1f9abaf7f')).rejects.toThrow('No data found')
    })
  })
})
