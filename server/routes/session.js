const bcrypt = require('bcrypt')
const express = require('express')
const sessionRoutes = express.Router()
const userHelper = require('../lib/util/user-helper')


module.exports = function (DataHelpers) {

  // handler for registration
  sessionRoutes.post('/register', (req, res) => {
    DataHelpers.getUser(`@${req.body.handle}`, (err, userHandle) => {
      if(userHandle) return res.status(403).send('User already registered')
      let user = {
        name: req.body.name,
        handle: `@${req.body.handle}`,
        password: bcrypt.hashSync(req.body.pass, 10),
        avatars: userHelper.generateRandomUser(),
      }

      console.log(req.body.handle, 'added to DB')
      DataHelpers.saveUser(user, (err, added) => {
        if (added) {
          console.log('Addition successfull')
          res.status(200).send(true)
        }
      })
    })
  })

  // handler for login
  sessionRoutes.post('/login', (req, res) => {
    let handle = `@${req.body.handle}`
    DataHelpers.getUser(handle, (err, user) => {
      if (!user) return res.status(404).send('No user found')
      if (!bcrypt.compareSync(req.body.pass, user.password)) {
        return res.status(403).send('Password is incorrect')
      }

      console.log('cookies set')
      req.session.userID = handle
      res.status(200).send(req.session.userID)
    })
  })

  // handler for logout
  sessionRoutes.post('/logout', (req, res) => {
    req.session = null
    res.clearCookie('userID')
    res.status(301).redirect('/')
  })

  return sessionRoutes
}
