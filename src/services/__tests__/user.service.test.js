import UserService from '../user.service'
import UserDB from '../../db/user.db'

jest.mock('../../db/user.db')

describe('User Service Test', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  it('should return expected result successfully when createUser fn is called', async () => {
    const createUserMock = jest
      .spyOn(UserDB.prototype, 'createUser')
      .mockImplementation(() => 101)

    const userService = new UserService()
    const userId = await userService.createUser('Tony Montana')

    expect(userId).toBeTruthy()
    expect(userId).toEqual(101)
    expect(createUserMock).toHaveBeenCalledTimes(1)
  })
  it('should throw an exception if required params are not provided when createUser fn is called', async () => {
    await expect(new UserService().createUser()).rejects.toThrow('')
  })
})
