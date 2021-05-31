const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', (req, res) => {
  const newData = req.body
  Restaurant.create(newData)
    .then(res.redirect('/'))
    .catch(error => console.error(error))
})

router.get('/search', (req, res) => {
  const keyword = req.query.keyword
  Restaurant.find({ $or: [{ name: { $regex: keyword, $options: 'i' } }, { category: { $regex: keyword, $options: 'i' } }] })
    .lean()
    .then((restaurants) => {
      res.render('index', { restaurants, keyword })
    })
    .catch(error => console.error(error))
})

router.get('/sort/:method', (req, res) => {
  const method = req.params.method === 'name_desc' ? 'name' : req.params.method
  const order = req.params.method === 'name_desc' ? 'desc' : 'asc'
  Restaurant.find()
    .lean()
    .sort({ [method]: order })
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

router.get('/:restaurant_id', (req, res) => {
  Restaurant.find({ _id: req.params.restaurant_id })
    .lean()
    .then((restaurants) => {
      const showRestaurant = restaurants[0]
      res.render('show', { showRestaurant })
    })
    .catch(error => console.error(error))
})

router.get('/:restaurant_id/edit', (req, res) => {
  Restaurant.find({ _id: req.params.restaurant_id })
    .lean()
    .then((restaurants) => {
      const editRestaurant = restaurants[0]
      res.render('edit', { editRestaurant })
    })
    .catch(error => console.error(error))
})

router.put('/:restaurant_id', (req, res) => {
  const mongoId = req.params.restaurant_id
  const {
    name, name_en: nameEn, category, image, location, phone, google_map: googleMap, rating, description
  } = req.body
  Restaurant.findById(mongoId)
    .then((restaurant) => {
      restaurant.name = name
      restaurant.name_en = nameEn
      restaurant.category = category
      restaurant.image = image
      restaurant.location = location
      restaurant.phone = phone
      restaurant.google_map = googleMap
      restaurant.rating = rating
      restaurant.description = description
      restaurant.save()
    })
    .then(res.redirect(`/restaurants/${mongoId}`))
    .catch(error => console.log(error))
})

router.delete('/:restaurant_id', (req, res) => {
  const id = req.params.restaurant_id
  Restaurant.findById(id)
    .then((restaurant) => restaurant.remove())
    .then(res.redirect('/'))
    .catch(error => console.error(error))
})

module.exports = router
