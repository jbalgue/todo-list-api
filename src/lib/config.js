/**
 * Note: Configs are set in the start-server.sh
 * See: start-server.sh
 */

/**
 * Returns a string config
 * @param {string} name
 * @param {string} defaultValue
 * @returns configValue
 */
export const string = (name, defaultValue = '') => {
  const val = process.env[name]
  if (!val) return `${defaultValue}`

  return `${val}`
}

/**
 * Returns an integer config
 * @param {string} name
 * @param {number} defaultValue
 * @returns configValue
 */
export const integer = (name, defaultValue) => {
  try {
    const val = process.env[name]
    if (!val) {
      const dv = parseInt(defaultValue, 10)
      if (Number.isNaN(dv)) throw new Error()

      return dv
    }

    return parseInt(val, 10)
  } catch (e) {
    throw new Error('No integer config value or default value set')
  }
}
