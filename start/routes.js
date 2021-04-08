'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route')

Route.get('/', 'ArticleController.index')

// Those routes should be only accessible
// when you are not logged in
Route.group(() => {
  Route.get('login', 'SessionController.create')
  Route.post('login', 'SessionController.store')

  Route.get('register', 'UserController.create')
  Route.post('register', 'UserController.store')
}).middleware(['guest'])

// Those routes should be only accessible
// when you are logged in
Route.group(() => {
  Route.get('logout', 'SessionController.delete')

  Route.get('home', 'UserController.index')

  Route.get('feeds', 'FeedController.index')
  Route.post('feeds', 'FeedController.store')
  Route.get('feeds/create', 'FeedController.create')
  Route.get('feeds/:id', 'FeedController.show')
  Route.get('refresh', 'FeedController.refresh')
  Route.delete('feeds/:id', 'FeedController.destroy')


}).middleware(['auth'])
