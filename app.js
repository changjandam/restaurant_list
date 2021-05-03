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

app.get('/restaurants/:restaurant_id', (req, res) => {
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

app.get('/restaurants/new/create', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('new'))
    .catch(error => console.error(error))
})

app.post('/restaurants/new/create', (req, res) => {
  const newData = req.body
  Restaurant.create(newData)
    .then(res.redirect('/'))
    .catch(error => console.error(error))
})

app.get('/restaurants/:restaurant_id/edit', (req, res) => {
  Restaurant.find({ _id: req.params.restaurant_id })
    .lean()
    .then((restaurants) => {
      const editRestaurant = restaurants[0]
      res.render('edit', { editRestaurant })
    })
    .catch(error => console.error(error))
})

app.post('/restaurants/:restaurant_id/edit', (req, res) => {
  const id = req.params.restaurant_id
  const updateData = req.body
  Restaurant.findById(id)
    .then((restaurant) => {
      restaurant.name = updateData.name
      restaurant.name_en = updateData.name_en
      restaurant.category = updateData.category
      restaurant.image = updateData.image
      restaurant.location = updateData.location
      restaurant.phone = updateData.phone
      restaurant.google_map = updateData.google_map
      restaurant.rating = updateData.rating
      restaurant.description = updateData.description
      restaurant.save()
    })
    .then(res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

// set port
const port = 3000
app.listen(port, () => {
  console.log(`The web is running on http://localhost:${port}`)
})
