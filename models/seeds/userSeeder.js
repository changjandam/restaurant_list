const bcrypt = require('bcryptjs')

const db = require('../../config/mongoose')
const User = require('../User')

const USER_SEEDS = [
  {
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678'
  },
  {
    name: 'user2',
    email: 'user2@example.com',
    password: '12345678'
  }
]

// db link success
db.once('open', async () => {
  for (let i = 0; i < USER_SEEDS.length; i++) {
    await bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(USER_SEEDS[i].password, salt))
      .then(async hash => {
        await User.create({
          email: USER_SEEDS[i].email,
          password: hash
        })
      })
  }

  console.log('user seed done')
  process.exit()
})
