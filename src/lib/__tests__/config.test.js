import * as config from './../config'

describe('Config Test', () => {
  const { env } = process

  beforeEach(() => {
    jest.resetModules()
    process.env = {
      TEST_STRING: 'test string',
      TEST_INTEGER: 111,
      ...env
    }
  })

  afterEach(() => {
    process.env = env
  })

  describe('config.string()', () => {
    it('should return string value', async () => {
      const configValue = config.string('TEST_STRING')

      expect(configValue).toEqual('test string')
    })

    it('should return default string value if no config value found', async () => {
      const configValue = config.string('WHATEVER', 'someDefaultValue')

      expect(configValue).toEqual('someDefaultValue')
    })
  })

  describe('config.integer()', () => {
    it('should return integer value', async () => {
      const configValue = config.integer('TEST_INTEGER')

      expect(configValue).toEqual(111)
    })

    it('should return default integer value if no config value found', async () => {
      const configValue = config.integer('WHATEVER', 222)

      expect(configValue).toEqual(222)
    })

    it('should throw an exception if integer config value or default value is not provided', async () => {
      expect(() => {
        config.integer('WHATEVER')
      }).toThrow('No integer config value or default value set')
    })
  })
})
