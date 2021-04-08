'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const parseRSS = use('App/Services/ParseRSS.js')
const Feed = use('App/Models/Feed')

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
      let feed = await Feed.findOrCreate({ title: res[0].feed_title, url: res[0].feed_url, link: res[0].feed_link }, { title: res[0].feed_title, url: res[0].feed_url, link: res[0].feed_link })

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

    feed.articles = await parseRSS(feed.url)
    feed.articles.sort((a,b) => b.date_published - a.date_published)

    return view.render('feeds.show', { feed: feed.toJSON() })
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

    await feed.delete()

    return response.redirect('back')
  }

  async random ({ view }) {
    // Grab some random feeds
    let feeds = (await Feed.pick(5)).toJSON()

    let articles = []

    for (let feed of feeds) {
      let parsed = await parseRSS(feed.url)
      articles = [...articles, ...parsed]
    }

    articles.sort((a, b) => b.date_published - a.date_published)

    if (articles.length > 25) articles.length = 25;

    return view.render('index', { articles })
  }
}

module.exports = FeedController
