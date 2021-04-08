'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Feed extends Model {
    articles () {
        return this.hasMany('App/Models/Article')
    }
    users () {
        return this.belongsToMany('App/Models/User')
    }
}

module.exports = Feed
