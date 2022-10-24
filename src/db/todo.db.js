import { strict as assert } from 'assert'
import { getCollection } from '../lib/mdb'
import { ObjectId } from 'mongodb'
import Logger from '../lib/Zlog'

const log = new Logger()

const TODO_COLLECTION = 'todos'

class TodoDBError extends Error {}

export default class TodoDB {

  /**
   * Save todo item to database
   * @param {string} userId
   * @param {*} details
   * @returns id
   */
  async createTodoItem(userId, { name, description }) {
    assert(userId, new TodoDBError('userId is required'))
    assert(name, new TodoDBError('name is required'))
    assert(description, new TodoDBError('description is required'))

    const ToDos = await getCollection(TODO_COLLECTION)
    const { insertedId } = await ToDos.insertOne({ userId, name, description, created: new Date() })

    return insertedId.toString()
  }


  /**
   * Fetch todo items based on userId. Optional `todoId`
   * @param {string} userId
   * @param {string} todoId
   * @param {*} pageDetails
   * @returns {Promise<{ pageInfo, todoItems }>}
   */
  async getTodosByUserId(userId, todoId = null, { page = 1, pageSize = 10 } = {}) {
    assert(userId, new TodoDBError('userId is required'))

    const pageInt = parseInt(page, 10)
    const pageSizeInt = parseInt(pageSize, 10)
    const pageInfo = {
      page: pageInt,
      pageSize: pageSizeInt,
      totalPages: 0,
      totalEntries: 0
    }

    const ToDos = await getCollection(TODO_COLLECTION)
    let todoItems = null
    try {
      const query = {
        $and: [
          { $expr: { $eq: ['$userId', ObjectId(userId)] } },
          todoId ? { $expr: { $eq: ['$_id', ObjectId(todoId)] } } : {},
        ]
      }

      const projectFields = {
        _id: 0,
        id: '$_id',// Alias
        name: 1,
        description: 1,
        created: 1,
        lastModified: 1,
      }

      let skip = 0
      if (!todoId) {
        const docsTotalCount = await ToDos.countDocuments(query)
        pageInfo.totalEntries = docsTotalCount

        const _pages = (docsTotalCount / pageSizeInt)
        const totalPages = parseInt((_pages % 1) > 0 ? _pages + 1 : _pages)
        pageInfo.totalPages = totalPages

        // We only show few details
        delete projectFields.description
        delete projectFields.created
        delete projectFields.lastModified

        // Offset
        skip = pageInt > 0 ? ((pageInt - 1) * pageSizeInt) : 0
      }

      todoItems = await ToDos.find(query)
        .project(projectFields)
        .sort({ _id: 1 })
        // This may have a performance issue if there are already large collections
        // See https://www.mongodb.com/docs/manual/reference/method/cursor.skip/#mongodb-method-cursor.skip
        // Potential improvements?
        // See https://javascript.plainenglish.io/improve-pagination-search-with-node-js-and-mongodb-ac38795d9ddd
        .skip(skip)
        .limit(pageSizeInt)
        .toArray()

      log.debug('todoItems ->', todoItems)
    } catch (e) {
      log.info(e)

      throw new TodoDBError('No data found')
    }

    return { pageInfo, todoItems }
  }

  /**
   * Update todo record
   * @param {string} userId
   * @param {string} todoId
   * @param {*} toUpdateDetails
   */
  async updateTodoItem(userId, todoId, { name, description } = {}) {
    assert(userId, new TodoDBError('userId is required'))
    assert(todoId, new TodoDBError('todoId is required'))

    const toUpdate = {}
    if (typeof name !== 'undefined') {
      toUpdate.name = name
    }

    if (typeof description !== 'undefined') {
      toUpdate.description = description
    }

    // Nothing to update
    if (!Object.entries(toUpdate).length) {
      return
    }

    const ToDos = await getCollection(TODO_COLLECTION)
    try {
      const result = await ToDos.updateOne(
        { userId: ObjectId(userId), _id: ObjectId(todoId) },
        {
          $set: toUpdate,
          $currentDate: { lastModified: true }
        }
      )

      if (result && !(result.acknowledged && result.modifiedCount)) {
        throw new TodoDBError(`Failed to update todo item [userId=${userId}, todoId=${todoId}]`)
      }
    } catch (e) {
      log.info(e)

      throw new TodoDBError('Failed to update')
    }
  }// - updateTodoItem

  /**
   * Delete todo item from database
   * @param {string} userId
   * @param {string} todoId
   */
  async removeTodoItem(userId, todoId) {
    assert(userId, new TodoDBError('userId is required'))
    assert(todoId, new TodoDBError('todoId is required'))

    const ToDos = await getCollection(TODO_COLLECTION)
    try {
      const result = await ToDos.deleteOne(
        { userId: ObjectId(userId), _id: ObjectId(todoId) },
      )

      if (result && !(result.acknowledged)) {
        throw new TodoDBError(`Failed to remove todo item [userId=${userId}, todoId=${todoId}]`)
      }
    } catch (e) {
      log.info(e)

      throw new TodoDBError('Failed to remove')
    }
  }// - removeTodoItem
}
