const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

require('./config/mongoose')

const app = express()
const routes = require('./routes')
const port = 3000
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(routes)

app.engine('handlebars', expressHandlebars({ defaultLayout: 'main', helpers: require('./config/handlebars-helpers') }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))

// set port
app.listen(port, () => {
  console.log(`The web is running on http://localhost:${port}`)
})
