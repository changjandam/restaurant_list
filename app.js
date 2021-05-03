// set express and express-handlebars
const express = require('express')
const app = express()
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
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

app.get('/restaurants/select/:restaurant_id', (req, res) => {
  Restaurant.find({ _id: req.params.restaurant_id })
    .lean()
    .then((restaurants) => {
      const showRestaurant = restaurants[0]
      res.render('show', { showRestaurant })
    })
    .catch(error => console.error(error))
})

app.get('/restaurants/search', (req, res) => {
  const keyword = req.query.keyword
  Restaurant.find({ $or: [{ name: { $regex: keyword, $options: 'i' } }, { category: { $regex: keyword, $options: 'i' } }] })
    .lean()
    .then((restaurants) => {
      res.render('index', { restaurants, keyword })
    })
    .catch(error => console.error(error))
})

app.get('/restaurants/new', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('new'))
    .catch(error => console.error(error))
})

app.post('/', (req, res) => {
  Restaurant.create(
    {
      name: req.body.name,
      name_en: req.body.name_en,
      category: req.body.category,
      image: req.body.image,
      location: req.body.location,
      phone: req.body.phone,
      google_map: req.body.google_map,
      rating: req.body.rating,
      description: req.body.description
    }
  )
    .then(res.redirect('/'))
    .catch(error => console.error(error))
})

// set port
const port = 3000
app.listen(port, () => {
  console.log(`The web is running on http://localhost:${port}`)
})
