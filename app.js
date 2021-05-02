// set express and express-handlebars
const express = require('express')
const app = express()
const expressHandlebars = require('express-handlebars')
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// set mongoose
const mongoose = require('mongoose')
const Restaurant = require('./models/restaurant')
mongoose.connect('mongodb://localhost/restaurant_list', { useNewUrlParser: true, useUnifiedTopology: true })
// get db status
const db = mongoose.connection
// db link err
db.on('error', () => {
  console.log('mongodb error.')
})
// db link success
db.once('open', () => {
  console.log('mongodb connected.')
})

// set public file
app.use(express.static('public'))

// set path
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  Restaurant.find({ id: parseInt(req.params.restaurant_id) })
    .lean()
    .then((restaurant) => {
      const showRestaurant = restaurant[0]
      res.render('show', { showRestaurant })
    })
    .catch(error => console.error(error))
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  Restaurant.find({ $or: [{ name: { $regex: keyword, $options: 'i' } }, { category: { $regex: keyword, $options: 'i' } }] })
    .lean()
    .then((restaurants) => {
      res.render('index', { restaurants, keyword })
    })
    .catch(error => console.error(error))
})

// set port
const port = 3000
app.listen(port, () => {
  console.log(`The web is running on http://localhost:${port}`)
})
