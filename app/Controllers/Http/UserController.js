'use strict'

const User = use('App/Models/User')
const Article = use('App/Models/Article')
const { validateAll } = use('Validator')

class UserController {

  async index ({ auth, view }) {
    // Grab the IDs of the feeds the user is subscribed to
    let feedIDs = (await auth.user.feeds().select('id').fetch()).toJSON().map((item => item.id))

    let articles = await Article
      .query()
      .whereIn('feed_id', feedIDs)
      .orderBy('date_published', 'desc')
      .with('feed')
      .limit(25)
      .fetch();

    return view.render('index', { articles: articles.toJSON() })
  }

  create ({ view }) {
    /**
     * Render the view 'user.create'.
     *
     * ref: http://adonisjs.com/docs/4.1/views
     */
    return view.render('user.create')
  }

  async store ({ auth, session, request, response }) {
    /**
     * Getting needed parameters.
     *
     * ref: http://adonisjs.com/docs/4.1/request#_only
     */
    const data = request.only(['username', 'email', 'password', 'password_confirmation'])

    /**
     * Validating our data.
     *
     * ref: http://adonisjs.com/docs/4.1/validator
     */
    const validation = await validateAll(data, {
      username: 'required|unique:users',
      email: 'required|email|unique:users',
      password: 'required',
      password_confirmation: 'required_if:password|same:password',
    })

    /**
     * If validation fails, early returns with validation message.
     */
    if (validation.fails()) {
      session
        .withErrors(validation.messages())
        .flashExcept(['password'])

      return response.redirect('back')
    }

    // Deleting the confirmation field since we don't
    // want to save it
    delete data.password_confirmation

    /**
     * Creating a new user into the database.
     *
     * ref: http://adonisjs.com/docs/4.1/lucid#_create
     */
    const user = await User.create(data)

    // Authenticate the user
    await auth.login(user)

    return response.route('/home')
  }
}

module.exports = UserController
