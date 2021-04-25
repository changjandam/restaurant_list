// set express and express-handlebars
const express = require('express')
const app = express()
const expressHandlebars = require('express-handlebars')
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// set public file
app.use(express.static('public'))

// import restaurant list
const restaurantList = require('./restaurant.json').results

// set path
app.get('/', (req, res) => {
  res.render('index', { restaurantList })
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const showRestaurant = restaurantList[parseInt(req.params.restaurant_id) - 1]
  res.render('show', { showRestaurant })
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const matchedRestaurant = restaurantList.filter(restaurant => restaurant.name.toLowerCase().includes(keyword.toLowerCase()) | restaurant.category.toLowerCase().includes(keyword.toLowerCase()))
  res.render('index', { restaurantList: matchedRestaurant, keyword })
})

// set port
const port = 3000
app.listen(port, () => {
  console.log(`The web app is running on http://localhost:${port}`)
})
