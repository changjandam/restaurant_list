const express = require('express')
const router = express.Router()

router.get('/login', (req, res) => {
  res.send('get login')
})

router.post('/login', (req, res) => {

})

router.get('/register', (req, res) => {
  res.send('get register')
})

router.post('/register', (req, res) => {

})

router.get('/logout', (req, res) => {
  res.send('get logout')
})

module.exports = router
