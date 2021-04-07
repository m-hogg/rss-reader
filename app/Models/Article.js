'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Article extends Model {
    feed () {
        return this.belongsTo('App/Models/Feed', 'feed_id', 'id')
    }
}

module.exports = Article
