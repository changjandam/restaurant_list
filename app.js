const express = require('express')
const app = express()
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override')

app.use(methodOverride('_method'))

const routes = require('./routes')

app.use(routes)
app.use(bodyParser.urlencoded({ extended: true }))



app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

mongoose.connect('mongodb://localhost/restaurant_list', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error.')
})
db.once('open', () => {
  console.log('mongodb connected.')
})

app.use(express.static('public'))

// set port
const port = 3000
app.listen(port, () => {
  console.log(`The web is running on http://localhost:${port}`)
})
