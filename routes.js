'use strict'
const classRoute = require('./components/class/router')
const userRoute = require('./components/user/router')
module.exports = function (app, opts) {
  // Setup routes, middleware, and handlers
  app.get('/', (req, res) => {
    res.locals.name = '.'
    res.render('index')
  })

  app.use('/api/class', classRoute)
  app.use('/api/user', userRoute)
}
