const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

module.exports = router
router.get('/', function (req, res) {
  req.session.scenario = {}
  res.render('index')
})

router.get('/start', function (req, res) {
  req.session.scenario = {}
  res.render('start')
})

router.get('/sign-in', function (req, res) {
  res.render('sign-in')
})

router.post('/sign-in', function (req, res) {
  req.session.email = req.body.email
  res.redirect('/company-number')
})
router.get('/company-number', function (req, res) {
  req.session.scenario = {}
  res.render('company-number')
})

router.post('/company-number', function (req, res) {
  var companyNumber = req.session.data['company-number']
  req.session.scenario = require('../app/data/scenarios/' + companyNumber)
  res.redirect('/confirm-company')
})
router.get('/confirm-company', function (req, res) {
  var scenario = req.session.scenario
  res.render('confirm-company', {
    scenario: scenario
  })
})

router.post('/confirm-company', function (req, res) {
  req.session.email = req.body.email
  res.redirect('/authenticate')
})
router.get('/authenticate', function (req, res) {
  res.render('authenticate', {
    scenario: req.session.scenario
  })
})
router.post('/authenticate', function (req, res) {
  var authCode = req.body.authCode

  authCode = authCode.toUpperCase()
  res.redirect('/confirmation-statement-ro')
})
router.get('/confirmation-statement-ro', function (req, res, nl2br) {
  res.render('confirmation-statement-ro', {
    scenario: req.session.scenario
  })
})
router.post('/confirmation-statement-ro', function (req, res) {
  var ro = req.session.data['registered-office-address']

  switch (ro) {
    case 'yes':
      res.redirect('/confirmation-statement-officers')
      break
    case 'no':
      res.redirect('/wrong-ro')
      break
  }
})
router.get('/confirmation-statement-officers', function (req, res, nl2br) {
  res.render('confirmation-statement-officers', {
    scenario: req.session.scenario
  })
})
router.post('/confirmation-statement-officers', function (req, res) {
  var officers = req.session.data['officers']

  switch (officers) {
    case 'yes':
      res.redirect('/confirmation-statement-registers')
      break
    case 'no':
      res.redirect('/wrong-officers')
      break
  }
})
router.get('/confirmation-statement-registers', function (req, res, nl2br) {
  res.render('confirmation-statement-registers', {
    scenario: req.session.scenario
  })
})
router.post('/confirmation-statement-registers', function (req, res) {
  var registers = req.session.data['registers']

  switch (registers) {
    case 'yes':
      res.redirect('/confirmation-statement-sic')
      break
    case 'no':
      res.redirect('/wrong-registers')
      break
  }
})
router.get('/confirmation-statement-sic', function (req, res, nl2br) {
  res.render('confirmation-statement-sic', {
    scenario: req.session.scenario
  })
})
router.post('/confirmation-statement-sic', function (req, res) {
  var sic = req.session.data['sic']

  switch (sic) {
    case 'yes':
      res.redirect('/confirmation-statement-shareholder-capital')
      break
    case 'no':
      res.redirect('/wrong-sic')
      break
  }
})
router.get('/confirmation-statement', function (req, res) {
  var date = new Date()

  res.render('confirmation-statement', {
    scenario: req.session.scenario,
    date: date
  })
})
router.post('/confirmation-statement', function (req, res) {
  var authCode = req.body.authCode

  authCode = authCode.toUpperCase()
  res.redirect('/check-company-information')
})
router.get('/confirmation', function (req, res) {
  res.render('confirmation', {
    scenario: req.session.scenario,
    email: req.session.email
  })
})
