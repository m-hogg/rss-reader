'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const User = use('App/Models/User')

class UserSeeder {
  async run () {
    const users = [
      { username: "testuser", email: "test@user.com", password: "123123" },
      { username: "testuser2", email: "test2@user.com", password: "123123" },
      { username: "testuser3", email: "test3@user.com", password: "123123" },
      { username: "testuser4", email: "test4@user.com", password: "123123" },
      { username: "testuser5", email: "test5@user.com", password: "123123" }
    ]

    await User.createMany(users);
  }
}

module.exports = UserSeeder
