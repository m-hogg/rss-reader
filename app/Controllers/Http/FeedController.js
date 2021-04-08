'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const parseRSS = use('App/Services/ParseRSS.js')
const Feed = use('App/Models/Feed')
const Article = use('App/Models/Article')

/**
 * Resourceful controller for interacting with feeds
 */
class FeedController {
  /**
   * Show a list of all feeds for a user.
   * GET feeds
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ auth: { user }, request, response, view }) {
    const feeds = await user.feeds().fetch();

    return view.render('feeds.index', { feeds: feeds.toJSON() })
  }

  /**
   * Render a form to be used for creating a new feed.
   * GET feeds/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
    return view.render('feeds.create')
  }

  /**
   * Create/save a new feed.
   * POST feeds
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ auth, session, request, response }) {
    try {
      // Grab the url from the form and run it through the parser
      const { url } = request.only(['url'])
      let res = await parseRSS(url)

      // Find the feed if it already exists in our DB or create it if not
      let feed = await Feed.findOrCreate({ title: res.title, url: res.url, link: res.link }, { title: res.title, url: res.url, link: res.link })

      // Create the articles we found where they don't already exist
      for (let article of res.articles) {
        await Article.findOrCreate({ feed_id: feed.id, title: article.title }, { feed_id: feed.id, ...article })
      }

      // Associate feed with user
      await auth.user.feeds().attach([feed.id])

      // Flash a success message and redirect back
      session.flash({ success: 'Feed has been added successfully!' })
      return response.redirect('back')
      
    } catch (error) {
      console.log(error)
      session.withErrors({url: 'URL is invalid!'}).flashAll()
      return response.redirect('back')
    }
  }

  /**
   * Display a single feed.
   * GET feeds/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    const feed = await Feed.find(params.id)
    await feed.load('articles')

    return view.render('feeds.show', { feed: feed.toJSON() })
  }

  /**
   * Render a form to update an existing feed.
   * GET feeds/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Delete a feed with id.
   * DELETE feeds/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const feed = await Feed.find(params.id)

    await feed.articles().delete()
    await feed.delete()

    return response.redirect('back')
  }
}

module.exports = FeedController
