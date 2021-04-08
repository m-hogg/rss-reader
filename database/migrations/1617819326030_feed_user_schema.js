'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FeedUserSchema extends Schema {
  up () {
    this.create('feed_user', (table) => {
      table.integer('feed_id')
      table.integer('user_id')
      table.foreign('feed_id').references('feed.id')
      table.foreign('user_id').references('user.id')
    })
  }

  down () {
    this.drop('feed_user')
  }
}

module.exports = FeedUserSchema
