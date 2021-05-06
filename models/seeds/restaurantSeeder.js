const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
const restaurantList = require('../../restaurant.json').results
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
  for (let i = 0; i < restaurantList.length; i++) {
    Restaurant.create(
      {
        name: restaurantList[i].name,
        name_en: restaurantList[i].name_en,
        category: restaurantList[i].category,
        image: restaurantList[i].image,
        location: restaurantList[i].location,
        phone: restaurantList[i].phone,
        google_map: restaurantList[i].google_map,
        rating: restaurantList[i].rating,
        description: restaurantList[i].description
      }
    )
  }
})
