'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FeedUserSchema extends Schema {
  up () {
    this.create('feed_user', (table) => {
      table.increments()
      table.timestamps()
      table.integer('user_id')
      table.integer('feed_id')
    })
  }

  down () {
    this.drop('feed_users')
  }
}

module.exports = FeedUserSchema
