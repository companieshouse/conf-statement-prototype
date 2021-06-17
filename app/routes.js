const express = require('express')
const router = express.Router()
const moment = require('moment')

// Add your routes here - above the module.exports line

module.exports = router
router.get('/', function (req, res) {
  res.render('index')
})
// filter journey

router.get('/start-2', function (req, res) {
  res.render('start-2')
})
router.post('/start-2', function (req, res) {
  res.redirect('/sign-in')
})
router.get('/limited-company', function (req, res) {
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
router.get('/recognised-user', function (req, res) {
  var scenario = req.session.scenario
  var moment = require('moment') // require

  res.render('recognised-user', {
    scenario: scenario,
    moment: moment().format('D MMMM yyy')
  })
})
router.get('/your-filings', function (req, res) {
  var scenario = req.session.scenario
  var moment = require('moment') // require

  res.render('your-filings', {
    scenario: scenario,
    moment: moment().format('D MMMM yyy h:mm a')
  })
})
router.get('/start', function (req, res) {
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
  res.render('company-number')
})

router.post('/company-number', function (req, res) {
  var companyNumber = req.session.data['company-number']
  req.session.scenario = require('../app/data/scenarios/' + companyNumber)
  res.redirect('/confirm-company')
})
router.get('/confirm-company', function (req, res) {
  var scenario = req.session.scenario
  var moment = require('moment')
  res.render('confirm-company', {
    scenario: scenario,
    moment: moment().format('D MMMM yyy')
  })
})

router.post('/confirm-company', function (req, res) {
  res.redirect('/authenticate')
})
router.get('/paper-filing', function (req, res) {
  res.render('paper-filing', {
    scenario: req.session.scenario
  })
})
router.get('/authenticate', function (req, res) {
  res.render('authenticate', {
    scenario: req.session.scenario
  })
})
router.post('/authenticate', function (req, res) {
  var authCode = req.body.authCode
  var scenario = req.session.scenario

  authCode = authCode.toUpperCase()

  if (scenario.company.type === 'LLP') {
    res.redirect('/task-list')
  } else {
    res.redirect('/check-trading-status')
  }
})
router.get('/check-trading-status', function (req, res) {
  var scenario = req.session.scenario
  var tradingStatus = req.session.data['trading-status']

  res.render('check-trading-status', {
    scenario: scenario,
    tradingStatus: tradingStatus
  })
})
router.post('/check-trading-status', function (req, res) {
  var scenario = req.session.scenario
  var tradingStatus = req.session.data['trading-status']
  var errorFlag = false
  var tradingStatusError = {}
  var errorList = []

  if (typeof tradingStatus === 'undefined') {
    tradingStatusError.type = 'blank'
    tradingStatusError.text = 'Select yes if the company trading status is correct'
    tradingStatusError.href = '#trading-status'
    tradingStatusError.flag = true
  }
  if (tradingStatusError.flag) {
    errorList.push(tradingStatusError)
    errorFlag = true
  }
  if (errorFlag === true) {
    res.render('check-trading-status', {
      scenario: scenario,
      tradingStatus: tradingStatus,
      errorList: errorList,
      tradingStatusError: tradingStatusError
    })
    } else {

  switch (tradingStatus) {
    case 'yes':
    if (scenario.company.pscExempt === '0') {
      res.redirect('/task-list')
    } else {
      res.redirect('/psc-exempt-options')
    }
      break
    case 'no':
      res.redirect('/trading-stop')
      break
  }}
})
router.get('/trading-status', function (req, res) {
  var tradingStatus = req.session.data['trading-status']

  res.render('trading-status', {
    tradingStatus: tradingStatus,
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
router.get('/task-list-external', function (req, res) {
  var completedTasks = req.session.data['completed']
  var email = req.session.data['email']
  var exemption = req.session.data['exemption']
  var activeOfficers = req.session.data['active-officers']
  var activePscs = req.session.data['active-pscs']
  var activeMembers = req.session.data['active-members']
  var additionalPscs = req.session.data['additional-pscs']
  var additionalOfficers = req.session.data['additional-officers']
  var additionalMembers = req.session.data['additional-members']
  var members = req.session.data['members']
  var moment = require('moment') // require
  var officers = req.session.data['officers']
  var psc = req.session.data['psc']
  var pscStatement = req.session.data['psc-statement']
  var register = req.session.data['registers']
  var result = 0
  var ro = req.session.data['registered-office-address']
  var statementOfCapital = req.session.data['statement-of-capital']
  var shareholders = req.session.data['shareholders']
  var sic = req.session.data['sic']
  var trading = req.session.data['trading-status']

  res.render('task-list-external', {
    scenario: req.session.scenario,
    activeOfficers: activeOfficers,
    activePscs: activePscs,
    additionalPscs: additionalPscs,
    additionalOfficers: additionalOfficers,
    activeMembers: activeMembers,
    additionalMembers: additionalMembers,
    members: members,
    completedTasks: completedTasks,
    email: email,
    exemption: exemption,
    moment: moment().format('D MMMM yyy'),
    officers: officers,
    psc: psc,
    pscStatement: pscStatement,
    register: register,
    result: result,
    ro: ro,
    statementOfCapital: statementOfCapital,
    shareholders: shareholders,
    sic: sic,
    trading: trading
  })
})
router.post('/task-list-external', function (req, res) {
  res.redirect('/confirmation-statement/ro')
})
router.get('/task-list', function (req, res) {
  var completedTasks = req.session.data['completed']
  var email = req.session.data['email']
  var exemption = req.session.data['exemption']
  var activeDirectors = req.session.data['active-director']
  var activePscs = req.session.data['active-pscs']
  var activeMembers = req.session.data['active-members']
  var additionalPscs = req.session.data['additional-pscs']
  var additionalDirectors = req.session.data['additional-directors']
  var additionalMembers = req.session.data['additional-members']
  var members = req.session.data['members']
  var moment = require('moment') // require
  var officers = req.session.data['officers']
  var psc = req.session.data['psc']
  var pscStatement = req.session.data['psc-statement']
  var register = req.session.data['registers']
  var result = 0
  var ro = req.session.data['registered-office-address']
  var statementOfCapital = req.session.data['statement-of-capital']
  var shareholders = req.session.data['shareholders']
  var sic = req.session.data['sic']
  var trading = req.session.data['trading-status']

  res.render('task-list', {
    scenario: req.session.scenario,
    activeDirectors: activeDirectors,
    activePscs: activePscs,
    additionalPscs: additionalPscs,
    additionalDirectors: additionalDirectors,
    activeMembers: activeMembers,
    additionalMembers: additionalMembers,
    members: members,
    completedTasks: completedTasks,
    email: email,
    exemption: exemption,
    moment: moment().format('D MMMM yyy'),
    officers: officers,
    psc: psc,
    pscStatement: pscStatement,
    register: register,
    result: result,
    ro: ro,
    statementOfCapital: statementOfCapital,
    shareholders: shareholders,
    sic: sic,
    trading: trading
  })
})
router.post('/task-list', function (req, res) {
  res.redirect('/confirmation-statement/ro')
})
router.get('/confirmation-statement/ro', function (req, res, nl2br) {
  var email = req.session.data['email']
  var ro = req.session.data['registered-office-address']
  var checked = {}

  res.render('confirmation-statement/ro', {
    email: email,
    scenario: req.session.scenario,
    checked: checked,
    ro: ro
  })
})
router.post('/confirmation-statement/ro', function (req, res) {
  var email = req.session.data['email']
  var ro = req.session.data['registered-office-address']
  var checked = {}
  var errorFlag = false
  var roError = {}
  var errorList = []

  if (typeof ro === 'undefined') {
    roError.type = 'blank'
    roError.text = 'Select yes if the registered office address is correct'
    roError.href = '#officers'
    roError.flag = true
  }
  if (roError.flag) {
    errorList.push(roError)
    errorFlag = true
  }
  if (errorFlag === true) {
    res.render('confirmation-statement/ro', {
      scenario: req.session.scenario,
      ro: ro,
      errorList: errorList,
      roError: roError
    })
    } else {

  switch (ro) {
    case 'yes':
      checked.yes = true
      res.redirect('/task-list')
      break
    case 'no':
      checked.yes = true
      res.redirect('/incorrect-information/wrong-ro')
      break
  }}
})
router.get('/incorrect-information/wrong-ro', function (req, res) {
  var email = req.session.data['email']
  res.render('incorrect-information/wrong-ro', {
    scenario: req.session.scenario,
    email: email
  })
})
router.post('/incorrect-information/wrong-ro', function (req, res) {
  res.redirect('/task-list')
})
router.get('/change-data/change-address', function (req, res) {
  var scenario = req.session.scenario
  var moment = require('moment') // require

  res.render('change-data/change-address', {
    scenario: scenario,
    moment: moment().format('D MMMM yyy h:mm a')
  })
})
router.get('/change-data/change-address-confirmation', function (req, res) {
var email = req.session.data['email']
  var scenario = req.session.scenario
  var moment = require('moment') // require

  res.render('change-data/change-address-confirmation', {
    email: email,
    scenario: scenario,
    moment: moment().format('D MMMM yyy h:mm a')
  })
})
// officers start //
router.get('/confirmation-statement/active-officers', function (req, res) {
  var email = req.session.data['email']
  var activeDirectors = req.session.data['active-directors']

  res.render('confirmation-statement/active-officers', {
    scenario: req.session.scenario,
    email: email,
    activeDirectors: activeDirectors
  })
})
router.post('/confirmation-statement/active-officers', function (req, res) {
  var activeDirectors = req.session.data['active-directors']
  var errorFlag = false
  var activeDirectorsError = {}
  var errorList = []

  if (typeof activeDirectors === 'undefined') {
    activeDirectorsError.type = 'blank'
    activeDirectorsError.text = 'Select yes if the active directors are correct'
    activeDirectorsError.href = '#active-directors'
    activeDirectorsError.flag = true
  }
  if (activeDirectorsError.flag) {
    errorList.push(activeDirectorsError)
    errorFlag = true
  }
  if (errorFlag === true) {
    res.render('confirmation-statement/active-officers', {
      scenario: req.session.scenario,
      activeDirectors: activeDirectors,
      errorList: errorList,
      activeDirectorsError: activeDirectorsError
    })
    } else {


  switch (activeDirectors) {
    case 'yes':
      res.redirect('/confirmation-statement/officers')
      break
    case 'no':
      res.redirect('/incorrect-information/wrong-active-officers')
      break
  }}
})
router.get('/confirmation-statement/officers', function (req, res) {
  var email = req.session.data['email']
  var officers = req.session.data['officers']

  res.render('confirmation-statement/officers', {
    email: email,
    scenario: req.session.scenario,
    officers: officers
  })
})
router.post('/confirmation-statement/officers', function (req, res) {
  var officers = req.session.data['officers']
  var errorFlag = false
  var directorDetailsError = {}
  var errorList = []

  if (typeof officers === 'undefined') {
    directorDetailsError.type = 'blank'
    directorDetailsError.text = 'Select yes if the director details are correct'
    directorDetailsError.href = '#officers'
    directorDetailsError.flag = true
  }
  if (directorDetailsError.flag) {
    errorList.push(directorDetailsError)
    errorFlag = true
  }
  if (errorFlag === true) {
    res.render('confirmation-statement/officers', {
      scenario: req.session.scenario,
      officers: officers,
      errorList: errorList,
      directorDetailsError: directorDetailsError
    })
    } else {


  switch (officers) {
    case 'yes':
      res.redirect('/confirmation-statement/additional-officers')
      break
    case 'no':
      res.redirect('/incorrect-information/wrong-officers')
      break
  }}
})
router.get('/confirmation-statement/additional-officers', function (req, res) {
  var email = req.session.data['email']
  var additionalDirectors = req.session.data['additional-directors']

  res.render('confirmation-statement/additional-officers', {
    email: email,
    scenario: req.session.scenario,
    additionalDirectors: additionalDirectors
  })
})
router.post('/confirmation-statement/additional-officers', function (req, res) {
  var additionalDirectors = req.session.data['additional-directors']
  var errorFlag = false
  var additionalDirectorsError = {}
  var errorList = []

  if (typeof additionalDirectors === 'undefined') {
    additionalDirectorsError.type = 'blank'
    additionalDirectorsError.text = 'Select no if there are no directors to appoint'
    additionalDirectorsError.href = '#additional-directors'
    additionalDirectorsError.flag = true
  }
  if (additionalDirectorsError.flag) {
    errorList.push(additionalDirectorsError)
    errorFlag = true
  }
  if (errorFlag === true) {
    res.render('confirmation-statement/additional-officers', {
      scenario: req.session.scenario,
      additionalDirectors: additionalDirectors,
      errorList: errorList,
      additionalDirectorsError: additionalDirectorsError
    })
    } else {


  switch (additionalDirectors) {
    case 'yes':
      res.redirect('/incorrect-information/wrong-appoint-officers')
      break
    case 'no':
      res.redirect('/task-list')
      break
  }}
})
router.get('/confirmation-statement/officers-2', function (req, res) {
  var email = req.session.data['email']
  res.render('confirmation-statement/officers-2', {
    scenario: req.session.scenario,
    email: email
  })
})
router.post('/confirmation-statement/officers-2', function (req, res) {
  var officers = req.session.data['officers']

  switch (officers) {
    case 'yes':
      res.redirect('/task-list')
      break
    case 'no':
      res.redirect('/incorrect-information/wrong-officers')
      break
  }
})
router.get('/incorrect-information/wrong-active-officers', function (req, res) {
  var email = req.session.data['email']
  res.render('incorrect-information/wrong-active-officers', {
    scenario: req.session.scenario,
    email: email
  })
})
router.post('/incorrect-information/wrong-active-officers', function (req, res) {
  res.redirect('/task-list')
})
router.get('/incorrect-information/wrong-officers', function (req, res) {
  var email = req.session.data['email']
  res.render('incorrect-information/wrong-officers', {
    scenario: req.session.scenario,
    email: email
  })
})
router.post('/incorrect-information/wrong-officers', function (req, res) {
  res.redirect('/task-list')
})
router.get('/incorrect-information/wrong-appoint-officers', function (req, res) {
  var email = req.session.data['email']
  res.render('incorrect-information/wrong-appoint-officers', {
    scenario: req.session.scenario,
    email: email
  })
})
router.post('/incorrect-information/wrong-appoint-officers', function (req, res) {
  res.redirect('/task-list')
})
// members start //
router.get('/confirmation-statement/active-members', function (req, res) {
  var email = req.session.data['email']
  var activeMembers = req.session.data['active-members']

  res.render('confirmation-statement/active-members', {
    email: email,
    scenario: req.session.scenario,
    activeMembers: activeMembers
  })
})
router.post('/confirmation-statement/active-members', function (req, res) {
  var activeMembers = req.session.data['active-members']

  switch (activeMembers) {
    case 'yes':
      res.redirect('/confirmation-statement/members')
      break
    case 'no':
      res.redirect('/incorrect-information/wrong-members')
      break
  }
})
router.get('/confirmation-statement/members', function (req, res) {
  var members = req.session.data['members']
  var email = req.session.data.email

  res.render('confirmation-statement/members', {
    scenario: req.session.scenario,
    email: email,
    members: members
  })
})
router.post('/confirmation-statement/members', function (req, res) {
  var members = req.session.data['members']

  switch (members) {
    case 'yes':
      res.redirect('/confirmation-statement/additional-members')
      break
    case 'no':
      res.redirect('/incorrect-information/wrong-members')
      break
  }
})
router.get('/confirmation-statement/additional-members', function (req, res) {
  var additionalMembers = req.session.data['additional-members']
  var email = req.session.data['email']

  res.render('confirmation-statement/additional-members', {
    scenario: req.session.scenario,
    email: email,
    additionalMembers: additionalMembers
  })
})
router.post('/confirmation-statement/additional-members', function (req, res) {
  var additionalMembers = req.session.data['additional-members']

  switch (additionalMembers) {
    case 'yes':
      res.redirect('/incorrect-information/wrong-members')
      break
    case 'no':
      res.redirect('/task-list')
      break
  }
})
router.get('/incorrect-information/wrong-members', function (req, res) {
  var email = req.session.data['email']
  res.render('incorrect-information/wrong-members', {
    scenario: req.session.scenario,
    email: email
  })
})
router.post('/incorrect-information/wrong-members', function (req, res) {
  res.redirect('/task-list')
})
// end of officers //
router.get('/confirmation-statement/registers', function (req, res) {
  var email = req.session.data['email']
  var registers = req.session.data['registers']
  res.render('confirmation-statement/registers', {
    scenario: req.session.scenario,
    email: email,
    registers: registers
  })
})
router.post('/confirmation-statement/registers', function (req, res) {
  var registers = req.session.data['registers']

  switch (registers) {
    case 'yes':
      res.redirect('/task-list')
      break
    case 'no':
      res.redirect('/incorrect-information/wrong-registers')
      break
  }
})
router.get('/incorrect-information/wrong-registers', function (req, res) {
  var email = req.session.data['email']
  res.render('incorrect-information/wrong-registers', {
    scenario: req.session.scenario,
    email: email
  })
})
router.post('/incorrect-information/wrong-registers', function (req, res) {
  res.redirect('/task-list')
})
router.get('/confirmation-statement/sic', function (req, res) {
  var email = req.session.data['email']
  var sic = req.session.data['sic']
  res.render('confirmation-statement/sic', {
    scenario: req.session.scenario,
    sic: sic,
    email: email
  })
})
router.post('/confirmation-statement/sic', function (req, res) {
  var sic = req.session.data['sic']
  var errorFlag = false
  var sicError = {}
  var errorList = []

  if (typeof sic === 'undefined') {
    sicError.type = 'blank'
    sicError.text = 'Select yes if the SIC codes are correct'
    sicError.href = '#sic'
    sicError.flag = true
  }
  if (sicError.flag) {
    errorList.push(sicError)
    errorFlag = true
  }
  if (errorFlag === true) {
    res.render('confirmation-statement/sic', {
      scenario: req.session.scenario,
      sic: sic,
      errorList: errorList,
      sicError: sicError
    })
    } else {

  switch (sic) {
    case 'yes':
      res.redirect('/task-list')
      break
    case 'no':
      res.redirect('/incorrect-information/wrong-sic')
      break
  }}
})
router.get('/incorrect-information/wrong-sic', function (req, res) {
  var email = req.session.data['email']
  res.render('incorrect-information/wrong-sic', {
    scenario: req.session.scenario,
    email: email
  })
})
router.post('/incorrect-information/wrong-sic', function (req, res) {
  res.redirect('/task-list')
})
router.get('/confirmation-statement/statement-of-capital', function (req, res) {
  var email = req.session.data['email']
  var statementOfCapital = req.session.data['statement-of-capital']
  res.render('confirmation-statement/statement-of-capital', {
    scenario: req.session.scenario,
    email: email,
    statementOfCapital: statementOfCapital
  })
})
router.post('/confirmation-statement/statement-of-capital', function (req, res) {
  var statementOfCapital = req.session.data['statement-of-capital']
  var trading = req.session.data['trading']
  var errorFlag = false
  var statementOfCapitalError = {}
  var errorList = []

  if (typeof statementOfCapital === 'undefined') {
    statementOfCapitalError.type = 'blank'
    statementOfCapitalError.text = 'Select yes if the statement of capital is correct'
    statementOfCapitalError.href = '#statement-of-capital'
    statementOfCapitalError.flag = true
  }
  if (statementOfCapitalError.flag) {
    errorList.push(statementOfCapitalError)
    errorFlag = true
  }
  if (errorFlag === true) {
    res.render('confirmation-statement/statement-of-capital', {
      scenario: req.session.scenario,
      statementOfCapital: statementOfCapital,
      errorList: errorList,
      statementOfCapitalError: statementOfCapitalError
    })
    } else {
  switch (statementOfCapital) {
    case 'yes':
      if (trading === 'yes') {
        res.redirect('/task-list')
      } else {
        res.redirect('/task-list')
      }
      break
    case 'no':
      res.redirect('/incorrect-information/wrong-statement-of-capital')
      break
  }}
})
router.get('/incorrect-information/wrong-statement-of-capital', function (req, res) {
  var email = req.session.data['email']
  res.render('incorrect-information/wrong-statement-of-capital', {
    scenario: req.session.scenario,
    email: email
  })
})
router.post('/incorrect-information/wrong-statement-of-capital', function (req, res) {
  res.redirect('/task-list')
})
router.get('/confirmation-statement/shareholders', function (req, res) {
  var email = req.session.data['email']
  res.render('confirmation-statement/shareholders', {
    scenario: req.session.scenario,
    email: email
  })
})
router.post('/confirmation-statement/shareholders', function (req, res) {
  var shareholders = req.session.data['shareholders']
  var tradingStatus = req.session.data['trading-status']

  switch (shareholders) {
    case 'yes':
      res.redirect('/task-list')
      break
    case 'no':
      res.redirect('/incorrect-information/wrong-shareholders')
      break
  }
})
router.get('/incorrect-information/wrong-shareholders', function (req, res) {
  var email = req.session.data['email']
  res.render('incorrect-information/wrong-shareholders', {
    scenario: req.session.scenario,
    email: email
  })
})
router.post('/incorrect-information/wrong-shareholders', function (req, res) {
  res.redirect('/task-list')
})
router.get('/psc-exemption', function (req, res) {
  var email = req.session.data['email']
  res.render('psc-exemption', {
    scenario: req.session.scenario,
    email: email
  })
})
router.post('/psc-exemption', function (req, res) {
  var exemption = req.session.data['exemption']

  switch (exemption) {
    case 'yes':
      res.redirect('/psc-exempt-options')
      break
    case 'no':
      res.redirect('/confirmation-statement/people-with-significant-control')
      break
  }
})
router.get('/psc-exempt-options', function (req, res) {
  var email = req.session.data['email']
  res.render('psc-exempt-options', {
    scenario: req.session.scenario,
    email: email
  })
})
router.post('/psc-exempt-options', function (req, res) {
  res.redirect('/task-list')
})
router.get('/confirmation-statement/active-pscs', function (req, res) {
  var activePscs = req.session.data['active-pscs']
  var email = req.session.data['email']
  res.render('confirmation-statement/active-pscs', {
    scenario: req.session.scenario,
    activePscs: activePscs,
    email: email
  })
})
router.post('/confirmation-statement/active-pscs', function (req, res) {
  var activePscs = req.session.data['active-pscs']
  var errorFlag = false
  var activePscsError = {}
  var errorList = []

  if (typeof activePscs === 'undefined') {
    activePscsError.type = 'blank'
    activePscsError.text = 'Select yes if the active PSCs are correct'
    activePscsError.href = '#active-pscs'
    activePscsError.flag = true
  }
  if (activePscsError.flag) {
    errorList.push(activePscsError)
    errorFlag = true
  }
  if (errorFlag === true) {
    res.render('confirmation-statement/active-pscs', {
      scenario: req.session.scenario,
      activePscs: activePscs,
      errorList: errorList,
      activePscsError: activePscsError
    })
    } else {


  switch (activePscs) {
    case 'yes':
      res.redirect('/confirmation-statement/people-with-significant-control')
      break
    case 'no':
      res.redirect('/incorrect-information/wrong-active-psc')
      break
  }}
})
router.get('/incorrect-information/wrong-active-psc', function (req, res) {
  var email = req.session.data['email']
  res.render('incorrect-information/wrong-active-psc', {
    scenario: req.session.scenario,
    email: email
  })
})
router.post('/incorrect-information/wrong-active-psc', function (req, res) {
  res.redirect('/task-list')
})
router.get('/confirmation-statement/people-with-significant-control', function (req, res) {
  var psc = req.session.data['psc']
  var email = req.session.data['email']
  res.render('confirmation-statement/people-with-significant-control', {
    scenario: req.session.scenario,
    psc: psc,
    email: email
  })
})
router.post('/confirmation-statement/people-with-significant-control', function (req, res) {
  var psc = req.session.data['psc']
  var errorFlag = false
  var pscDetailsError = {}
  var errorList = []

  if (typeof psc === 'undefined') {
    pscDetailsError.type = 'blank'
    pscDetailsError.text = 'Select yes if the psc details are correct'
    pscDetailsError.href = '#officers'
    pscDetailsError.flag = true
  }
  if (pscDetailsError.flag) {
    errorList.push(pscDetailsError)
    errorFlag = true
  }
  if (errorFlag === true) {
    res.render('confirmation-statement/people-with-significant-control', {
      scenario: req.session.scenario,
      psc: psc,
      errorList: errorList,
      pscDetailsError: pscDetailsError
    })
    } else {


  switch (psc) {
    case 'yes':
      res.redirect('/confirmation-statement/additional-pscs')
      break
    case 'no':
      res.redirect('/incorrect-information/wrong-psc-details')
      break
  }}
})
router.get('/confirmation-statement/additional-pscs', function (req, res) {
  var email = req.session.data['email']
  var additionalPscs = req.session.data['additional-pscs']
  res.render('confirmation-statement/additional-pscs', {
    scenario: req.session.scenario,
    additionalPscs: additionalPscs,
    email: email
  })
})
router.post('/confirmation-statement/additional-pscs', function (req, res) {
  var additionalPscs = req.session.data['additional-pscs']

  switch (additionalPscs) {
    case 'no':
      res.redirect('/confirmation-statement/psc-statement')
      break
    case 'yes':
      res.redirect('/incorrect-information/wrong-appoint-psc')
      break
  }
})
router.get('/incorrect-information/wrong-appoint-psc', function (req, res) {
  var email = req.session.data['email']
  res.render('incorrect-information/wrong-appoint-psc', {
    scenario: req.session.scenario,
    email: email
  })
})
router.post('/incorrect-information/wrong-appoint-psc', function (req, res) {
  res.redirect('/task-list')
})
router.get('/incorrect-information/wrong-psc', function (req, res) {
  var email = req.session.data['email']
  res.render('incorrect-information/wrong-psc', {
    scenario: req.session.scenario,
    email: email
  })
})
router.post('/incorrect-information/wrong-psc', function (req, res) {
  res.redirect('/task-list')
})
router.get('/incorrect-information/wrong-psc-details', function (req, res) {
  var email = req.session.data['email']
  res.render('incorrect-information/wrong-psc-details', {
    scenario: req.session.scenario,
    email: email
  })
})
router.post('/incorrect-information/wrong-psc-details', function (req, res) {
  res.redirect('/task-list')
})
router.get('/confirmation-statement/psc-statement', function (req, res) {
  var pscStatement = req.session.data['psc-statement']
  var email = req.session.data['email']
  res.render('confirmation-statement/psc-statement', {
    scenario: req.session.scenario,
    pscStatement: pscStatement,
    email: email
  })
})
router.post('/confirmation-statement/psc-statement', function (req, res) {
  var pscStatement = req.session.data['psc-statement']

  switch (pscStatement) {
    case 'yes':
      res.redirect('/task-list')
      break
    case 'no':
      res.redirect('/incorrect-information/wrong-psc-statement')
      break
  }
})
router.get('/incorrect-information/wrong-psc-statement', function (req, res) {
  var email = req.session.data['email']
  res.render('incorrect-information/wrong-psc-statement', {
    scenario: req.session.scenario,
    email: email
  })
})
router.post('/incorrect-information/wrong-psc-statement', function (req, res) {
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
  res.redirect('/confirmation-statement/review')
})
router.get('/confirmation-statement/review', function (req, res) {
  var date = new Date()
  var exemption = req.session.data['exemption']
  var email = req.session.data['email']
  var moment = require('moment') // require

  res.render('confirmation-statement/review', {
    scenario: req.session.scenario,
    date: date,
    moment: moment().format('D MMMM yyy'),
    exemption: exemption,
    email: email
  })
})
router.get('/print-confirmation-statement-review', function (req, res) {
  var date = new Date()
  var email = req.session.data['email']
  var moment = require('moment') // require

  res.render('print-confirmation-statement-review', {
    scenario: req.session.scenario,
    date: date,
    moment: moment().format('D MMMM yyy'),
    email: email
  })
})
router.get('/review-payment', function (req, res) {
  var moment = require('moment') // require
  var email = req.session.data['email']

  res.render('review-payment', {
    scenario: req.session.scenario,
    moment: moment().format('D MMMM yyy'),
    email: email
  })
})
router.post('/review-payment', function (req, res) {
  res.redirect('/payment-options')
})
router.get('/payment-options', function (req, res) {
  var email = req.session.data['email']
  res.render('payment-options', {
    scenario: req.session.scenario,
    email: email
  })
})
router.post('/payment-options', function (req, res) {
  var paymentOptions = req.session.data['payment-options']

  switch (paymentOptions) {
    case 'card':
      res.redirect('https://products.payments.service.gov.uk/pay/f90761a2258f4b60baa29f045cd78ca2')
      break
    case 'account':
      res.redirect('/pay-by-account')
      break
  }
})
router.get('/pay-by-account', function (req, res) {
  var email = req.session.data['email']
  res.render('pay-by-account', {
    email: email
  })
})
router.post('/pay-by-account', function (req, res) {
  res.redirect('/confirmation')
})
router.get('/confirmation', function (req, res) {
  var email = req.session.data.email
  var paymentOptions = req.session.data['payment-options']

  res.render('confirmation', {
    scenario: req.session.scenario,
    email: email,
    paymentOptions: paymentOptions
  })
})
