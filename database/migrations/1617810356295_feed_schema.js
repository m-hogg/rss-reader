'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FeedSchema extends Schema {
  up () {
    this.create('feeds', (table) => {
      table.increments()
      table.timestamps()
      table.string('title', 50).notNullable().unique()
      table.string('url').notNullable().unique()
    })
  }

  down () {
    this.drop('feeds')
  }
}

module.exports = FeedSchema
