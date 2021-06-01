const bcrypt = require('bcryptjs')

const db = require('../../config/mongoose')
const User = require('../User')

const USER_SEEDS = [
  {
    email: 'user1@exampel.com',
    password: '12345678'
  },
  {
    email: 'user2@exampel.com',
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

  console.log('seed done')
  process.exit()
})
