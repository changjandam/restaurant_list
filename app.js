const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const usePassport = require('./config/passport')
const flash = require('connect-flash')

require('./config/mongoose')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const routes = require('./routes')
const PORT = process.env.PORT
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.engine('hbs', exphbs({ defaultLayout: 'main', helpers: require('./config/handlebars-helpers'), extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.static('public'))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

usePassport(app)
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

app.use(routes)

// set port
app.listen(PORT, () => {
  console.log(`The web is running on http://localhost:${PORT}`)
})
