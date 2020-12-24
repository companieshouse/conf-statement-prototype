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
  res.redirect('/check-company-information')
})
