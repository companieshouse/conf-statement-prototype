const express = require('express')
const router = express.Router()
const moment = require('moment')

// Add your routes here - above the module.exports line

module.exports = router
router.get('/', function (req, res) {
  req.session.scenario = {}
  res.render('index')
})
// filter journey

router.get('/start-2', function (req, res) {
  req.session.scenario = {}
  res.render('start-2')
})
router.post('/start-2', function (req, res) {
  res.redirect('/limited-company')
})
router.get('/limited-company', function (req, res) {
  req.session.scenario = {}
  res.render('limited-company')
})
router.post('/limited-company', function (req, res) {
  var limitedCompany = req.session.data['limited-company']

  switch (limitedCompany) {
    case 'yes':
      res.redirect('/more-than-5-officers')
      break
    case 'no':
      res.redirect('/use-webfiling')
      break
  }
})
router.get('/more-than-5-officers', function (req, res) {
  req.session.scenario = {}
  res.render('more-than-5-officers')
})
router.post('/more-than-5-officers', function (req, res) {
  var fiveOfficers = req.session.data['5-officers']

  switch (fiveOfficers) {
    case 'moreThan6':
      res.redirect('/use-webfiling')
      break
    case 'upTo5':
      res.redirect('/more-than-5-shareholders')
      break
  }
})
router.get('/more-than-5-shareholders', function (req, res) {
  req.session.scenario = {}
  res.render('more-than-5-shareholders')
})
router.post('/more-than-5-shareholders', function (req, res) {
  var fiveShareholders = req.session.data['5-shareholders']

  switch (fiveShareholders) {
    case 'moreThan6':
      res.redirect('/use-webfiling')
      break
    case 'upTo5':
      res.redirect('/sign-in')
      break
  }
})
// standard journey
router.get('/your-filings', function (req, res) {
  var moment = require('moment') // require
  req.session.scenario = {}
  res.render('your-filings', {
    moment: moment().format('DD MMMM yyy h:mm a')
  })
})
router.get('/start', function (req, res) {
  req.session.scenario = {}
  res.render('start')
})
router.post('/start', function (req, res) {
  res.redirect('/sign-in')
})
router.get('/sign-in', function (req, res) {
  res.render('sign-in')
})

router.post('/sign-in', function (req, res) {
  var email = req.session.data['email']
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
  res.redirect('/trading-status')
})

router.get('/trading-status', function (req, res) {
  res.render('trading-status', {
    scenario: req.session.scenario
  })
})
router.post('/trading-status', function (req, res) {
  var tradingStatus = req.session.data['trading-status']

  switch (tradingStatus) {
    case 'yes':
      res.redirect('/trading-status-dtr5')
      break
    case 'no':
      res.redirect('/task-list')
      break
  }
})
router.get('/trading-status-dtr5', function (req, res) {
  res.render('trading-status-dtr5', {
    scenario: req.session.scenario
  })
})
router.post('/trading-status-dtr5', function (req, res) {
  res.redirect('/task-list')
})
router.get('/task-list', function (req, res) {
  var completedTasks = req.session.data['completed']
  var exemption = req.session.data['exemption']
  var officers = req.session.data['officers']
  var psc = req.session.data['psc']
  var register = req.session.data['registers']
  var ro = req.session.data['registered-office-address']
  var shareholderCapital = req.session.data['shareholder-capital']
  var shareholders = req.session.data['shareholders']
  var sic = req.session.data['sic']

  res.render('task-list', {
    scenario: req.session.scenario,
    completedTasks: completedTasks,
    exemption: exemption,
    officers: officers,
    psc: psc,
    register: register,
    ro: ro,
    shareholderCapital: shareholderCapital,
    shareholders: shareholders,
    sic: sic
  })
})
router.post('/task-list', function (req, res) {
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
      res.redirect('/task-list')
      break
    case 'no':
      res.redirect('/wrong-ro')
      break
  }
})
router.get('/wrong-ro', function (req, res) {
  res.render('wrong-ro', {
    scenario: req.session.scenario
  })
})
router.post('/wrong-ro', function (req, res) {
  res.redirect('/task-list')
})
router.get('/confirmation-statement-officers', function (req, res) {
  res.render('confirmation-statement-officers', {
    scenario: req.session.scenario
  })
})
router.post('/confirmation-statement-officers', function (req, res) {
  var officers = req.session.data['officers']

  switch (officers) {
    case 'yes':
      res.redirect('/task-list')
      break
    case 'no':
      res.redirect('/wrong-officers')
      break
  }
})
router.get('/confirmation-statement-officers-2', function (req, res) {
  res.render('confirmation-statement-officers-2', {
    scenario: req.session.scenario
  })
})
router.post('/confirmation-statement-officers-2', function (req, res) {
  var officers = req.session.data['officers']

  switch (officers) {
    case 'yes':
      res.redirect('/task-list')
      break
    case 'no':
      res.redirect('/wrong-officers')
      break
  }
})
router.get('/wrong-officers', function (req, res) {
  res.render('wrong-officers', {
    scenario: req.session.scenario
  })
})
router.post('/wrong-officers', function (req, res) {
  res.redirect('/task-list')
})
router.get('/confirmation-statement-registers', function (req, res) {
  res.render('confirmation-statement-registers', {
    scenario: req.session.scenario
  })
})
router.post('/confirmation-statement-registers', function (req, res) {
  var registers = req.session.data['registers']

  switch (registers) {
    case 'yes':
      res.redirect('/task-list')
      break
    case 'no':
      res.redirect('/wrong-registers')
      break
  }
})
router.get('/wrong-registers', function (req, res) {
  res.render('wrong-registers', {
    scenario: req.session.scenario
  })
})
router.post('/wrong-registers', function (req, res) {
  res.redirect('/task-list')
})
router.get('/confirmation-statement-sic', function (req, res) {
  res.render('confirmation-statement-sic', {
    scenario: req.session.scenario
  })
})
router.post('/confirmation-statement-sic', function (req, res) {
  var sic = req.session.data['sic']

  switch (sic) {
    case 'yes':
      res.redirect('/task-list-complete')
      break
    case 'no':
      res.redirect('/wrong-sic')
      break
  }
})
router.get('/wrong-sic', function (req, res) {
  res.render('wrong-sic', {
    scenario: req.session.scenario
  })
})
router.post('/wrong-sic', function (req, res) {
  res.redirect('/task-list')
})
router.get('/confirmation-statement-shareholder-capital', function (req, res) {
  res.render('confirmation-statement-shareholder-capital', {
    scenario: req.session.scenario
  })
})
router.post('/confirmation-statement-shareholder-capital', function (req, res) {
  var shareholderCapital = req.session.data['shareholder-capital']
  var trading = req.session.data['trading']

  switch (shareholderCapital) {
    case 'yes':
      if (trading === 'yes') {
        res.redirect('/task-list')
      } else {
        res.redirect('/task-list')
      }
      break
    case 'no':
      res.redirect('/wrong-shareholder-capital')
      break
  }
})
router.get('/wrong-shareholder-capital', function (req, res) {
  res.render('wrong-shareholder-capital', {
    scenario: req.session.scenario
  })
})
router.post('/wrong-shareholder-capital', function (req, res) {
  res.redirect('/task-list')
})
router.get('/confirmation-statement-shareholders', function (req, res) {
  res.render('confirmation-statement-shareholders', {
    scenario: req.session.scenario
  })
})
router.post('/confirmation-statement-shareholders', function (req, res) {
  var shareholders = req.session.data['shareholders']
  var tradingStatus = req.session.data['trading-status']

  switch (shareholders) {
    case 'yes':
      res.redirect('/task-list')
      break
    case 'no':
      res.redirect('/wrong-shareholders')
      break
  }
})
router.get('/wrong-shareholders', function (req, res) {
  res.render('wrong-shareholders', {
    scenario: req.session.scenario
  })
})
router.post('/wrong-shareholders', function (req, res) {
  res.redirect('/task-list')
})
router.get('/psc-exemption', function (req, res) {
  res.render('psc-exemption', {
    scenario: req.session.scenario
  })
})
router.post('/psc-exemption', function (req, res) {
  var exemption = req.session.data['exemption']

  switch (exemption) {
    case 'yes':
      res.redirect('/psc-exempt-options')
      break
    case 'no':
      res.redirect('/confirmation-statement-people-with-significant-control')
      break
  }
})
router.get('/psc-exempt-options', function (req, res) {
  res.render('psc-exempt-options', {
    scenario: req.session.scenario
  })
})
router.post('/psc-exempt-options', function (req, res) {
  var exempt = req.session.data['exempt']

  switch (exempt) {
    case 'yes':
      res.redirect('/task-list')
      break
    case 'no':
      res.redirect('/task-list')
      break
  }
})
router.get('/confirmation-statement-people-with-significant-control', function (req, res) {
  res.render('confirmation-statement-people-with-significant-control', {
    scenario: req.session.scenario
  })
})
router.post('/confirmation-statement-people-with-significant-control', function (req, res) {
  var psc = req.session.data['psc']

  switch (psc) {
    case 'yes':
      res.redirect('/confirmation-statement-psc-statement')
      break
    case 'no':
      res.redirect('/wrong-psc')
      break
  }
})
router.get('/wrong-psc', function (req, res) {
  res.render('wrong-psc', {
    scenario: req.session.scenario
  })
})
router.post('/wrong-psc', function (req, res) {
  res.redirect('/task-list')
})
router.get('/confirmation-statement-psc-statement', function (req, res) {
  res.render('confirmation-statement-psc-statement', {
    scenario: req.session.scenario
  })
})
router.post('/confirmation-statement-psc-statement', function (req, res) {
  var pscStatement = req.session.data['psc-statement']

  switch (pscStatement) {
    case 'yes':
      res.redirect('/task-list')
      break
    case 'no':
      res.redirect('/wrong-psc-statement')
      break
  }
})
router.get('/wrong-psc-statement', function (req, res) {
  res.render('wrong-psc-statement', {
    scenario: req.session.scenario
  })
})
router.post('/wrong-psc-statement', function (req, res) {
  res.redirect('/task-list')
})
router.get('/task-list-complete', function (req, res) {
  var completedTasks = req.session.data['completed']
  var exemption = req.session.data['exemption']
  var officers = req.session.data['officers']
  var psc = req.session.data['psc']
  var register = req.session.data['register']
  var ro = req.session.data['registered-office-address']

  res.render('task-list-complete', {
    scenario: req.session.scenario,
    completedTasks: completedTasks,
    exemption: exemption,
    officers: officers,
    psc: psc,
    register: register,
    ro: ro
  })
})
router.post('/task-list-complete', function (req, res) {
  res.redirect('/confirmation-statement-review')
})
router.get('/confirmation-statement-review', function (req, res) {
  var date = new Date()
  var exemption = req.session.data['exemption']
  var moment = require('moment') // require

  res.render('confirmation-statement-review', {
    scenario: req.session.scenario,
    date: date,
    moment: moment().format('DD MMMM yyy'),
    exemption: exemption
  })
})
router.post('/confirmation-statement-review', function (req, res) {
  res.redirect('https://products.payments.service.gov.uk/pay/f90761a2258f4b60baa29f045cd78ca2')
})
router.get('/confirmation', function (req, res) {
  var email = req.session.data.email

  res.render('confirmation', {
    scenario: req.session.scenario,
    email: email
  })
})
