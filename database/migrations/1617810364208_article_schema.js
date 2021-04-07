'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ArticleSchema extends Schema {
  up () {
    this.create('articles', (table) => {
      table.increments()
      table.timestamps()
      table.integer('feed_id')
      table.string('title')
      table.string('article_url')
      table.string('image_url')
      table.date('date_published')
      table.string('description')
    })
  }

  down () {
    this.drop('articles')
  }
}

module.exports = ArticleSchema
