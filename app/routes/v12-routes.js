const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()


module.exports=router;

// Show session data and URLs in the terminal  
router.use((req, res, next) => {  
  const log = {  
    method: req.method,  
    url: req.originalUrl,  
    data: req.session.data  
  }  
  console.log(JSON.stringify(log, null, 2))  
  next()  
}) 


router.get('/', function (req, res) {
  res.render('index')
})
// filter journey

router.get('/v12/start-2', function (req, res) {
  res.render('v12/start-2')
})
router.post('/v12/start-2', function (req, res) {
  res.redirect('/v12/sign-in')
})


router.get('/v12/limited-company', function (req, res) {
  res.render('v12/limited-company')
})
router.post('/v12/limited-company', function (req, res) {
  var limitedCompany = req.session.data['limited-company']

  switch (limitedCompany) {
    case 'yes':
      res.redirect('/v12/more-than-5-officers')
      break
    case 'no':
      res.redirect('/v12/use-webfiling')
      break
  }
})


router.get('/v12/more-than-5-officers', function (req, res) {
  res.render('v12/more-than-5-officers')
})
router.post('/v12/more-than-5-officers', function (req, res) {
  var fiveOfficers = req.session.data['5-officers']

  switch (fiveOfficers) {
    case 'moreThan6':
      res.redirect('/v12/use-webfiling')
      break
    case 'upTo5':
      res.redirect('/v12/more-than-5-shareholders')
      break
  }
})



router.get('/v12/more-than-5-shareholders', function (req, res) {
  res.render('v12/more-than-5-shareholders')
})
router.post('/v12/more-than-5-shareholders', function (req, res) {
  var fiveShareholders = req.session.data['5-shareholders']

  switch (fiveShareholders) {
    case 'moreThan6':
      res.redirect('/v12/use-webfiling')
      break
    case 'upTo5':
      res.redirect('/v12/sign-in')
      break
  }
})



// standard journey
router.get('/v12/recognised-user', function (req, res) {
  var scenario = req.session.scenario

  res.render('v12/recognised-user', {
    scenario: scenario
  })
})



router.get('/v12/your-filings', function (req, res) {
  var scenario = req.session.scenario

  res.render('v12/your-filings', {
    scenario: scenario
  })
})



router.get('/v12/start', function (req, res) {
  res.render('v12/start')
})
router.post('/v12/start', function (req, res) {
  res.redirect('/v12/sign-in')
})



router.get('/v12/sign-in', function (req, res) {
  res.render('v12/sign-in')
})

router.post('/v12/sign-in', function (req, res) {
  var email = req.session.data['email']
  res.redirect('/v12/company-number')
})



router.get('/v12/company-number', function (req, res) {
  res.render('v12/company-number')
})

router.post('/v12/company-number', function (req, res) {
  var companyNumber = req.session.data['company-number']
  req.session.scenario = require('../../app/data/scenarios/' + companyNumber)
  res.redirect('/v12/confirm-company')
})



router.get('/v12/confirm-company', function (req, res) {
  var scenario = req.session.scenario
  res.render('v12/confirm-company', {
    scenario: scenario
  })
})

router.post('/v12/confirm-company', function (req, res) {
  res.redirect('/v12/authenticate')
})



router.get('/v12/co-not-supported-use-webfiling', function (req, res) {
  var scenario = req.session.scenario
  res.render('v12/co-not-supported-use-webfiling', {
    scenario: scenario
  })
})


router.get('/v12/paper-filing', function (req, res) {
  res.render('v12/paper-filing', {
    scenario: req.session.scenario
  })
})



router.get('/v12/authenticate', function (req, res) {
  res.render('v12/authenticate', {
    scenario: req.session.scenario
  })
})

router.post('/v12/authenticate', function (req, res) {
  var authCode = req.body.authCode
  var scenario = req.session.scenario

  authCode = authCode.toUpperCase()

  if (scenario.company.type === 'LLP') {
    res.redirect('/v12/task-list')
  } else {
    res.redirect('/v12/check-trading-status')
  }
})



router.get('/v12/check-trading-status', function (req, res) {
  var scenario = req.session.scenario
  var tradingStatus = req.session.data['trading-status']

  res.render('v12/check-trading-status', {
    scenario: scenario,
    tradingStatus: tradingStatus
  })
})

router.post('/v12/check-trading-status', function (req, res) {
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
    res.render('v12/check-trading-status', {
      scenario: scenario,
      tradingStatus: tradingStatus,
      errorList: errorList,
      tradingStatusError: tradingStatusError
    })
    } else {

  switch (tradingStatus) {
    case 'yes':
    if (scenario.company.pscExempt === '0') {
      res.redirect('/v12/task-list')
    } else {
      res.redirect('/v12/psc-exempt-options')
    }
      break
    case 'no':
      res.redirect('/v12/trading-stop')
      break
  }}
})



router.get('/v12/trading-status', function (req, res) {
  var tradingStatus = req.session.data['trading-status']

  res.render('v12/trading-status', {
    tradingStatus: tradingStatus,
    scenario: req.session.scenario
  })
})

router.post('/v12/trading-status', function (req, res) {
  var tradingStatus = req.session.data['trading-status']

  switch (tradingStatus) {
    case 'yes':
      res.redirect('/v12/trading-status-dtr5')
      break
    case 'no':
      res.redirect('/v12/task-list')
      break
  }
})



router.get('/v12/trading-status-dtr5', function (req, res) {
  res.render('v12/trading-status-dtr5', {
    scenario: req.session.scenario
  })
})
router.post('/v12/trading-status-dtr5', function (req, res) {
  res.redirect('/v12/task-list')
})



router.get('/v12/task-list-external', function (req, res) {
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

  res.render('v12/task-list-external', {
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

router.post('/v12/task-list-external', function (req, res) {
  res.redirect('/v12/confirmation-statement/ro')
})



router.get('/v12/task-list', function (req, res) {
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

  res.render('v12/task-list', {
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

router.post('/v12/task-list', function (req, res) {
  res.redirect('/v12/confirmation-statement/ro')
})



router.get('/v12/confirmation-statement/ro', function (req, res, nl2br) {
  var email = req.session.data['email']
  var ro = req.session.data['registered-office-address']
  var taskList = req.session.data['taskList']
  var checked = {}

  res.render('v12/confirmation-statement/ro', {
    email: email,
    scenario: req.session.scenario,
    taskList: taskList,
    checked: checked,
    ro: ro
  })
})

router.post('/v12/confirmation-statement/ro', function (req, res) {
  var email = req.session.data['email']
  var ro = req.session.data['registered-office-address']
  var checked = {}
  var errorFlag = false
  var roError = {}
  var errorList = []
  var taskList = req.session.data['taskList']
  var govukButton = req.session.data['govukButton']

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
    res.render('v12/confirmation-statement/ro', {
      scenario: req.session.scenario,
      ro: ro,
      taskList: taskList,
      errorList: errorList,
      roError: roError
    })
    } else {

if ('taskList' == true) {
  checked.yes = true
  res.redirect('/v12/task-list')
} else {
  switch (ro) {
    case 'yes':
      checked.yes = true
      res.redirect('/v12/task-list')
      break
    case 'no':
      checked.yes = true
      res.redirect('/v12/incorrect-information/wrong-ro')
      break
    }
  }}
})



router.get('/v12/incorrect-information/wrong-ro', function (req, res) {
  var email = req.session.data['email']
  res.render('v12/incorrect-information/wrong-ro', {
    scenario: req.session.scenario,
    email: email
  })
})

router.post('/v12/incorrect-information/wrong-ro', function (req, res) {
  res.redirect('/v12/task-list')
})



router.get('/v12/change-data/change-address', function (req, res) {
  var scenario = req.session.scenario

  res.render('v12/change-data/change-address', {
    scenario: scenario
  })
})



router.get('/v12/change-data/change-address-confirmation', function (req, res) {
var email = req.session.data['email']
  var scenario = req.session.scenario

  res.render('v12/change-data/change-address-confirmation', {
    email: email,
    scenario: scenario
  })
})



// officers start //
router.get('/v12/confirmation-statement/active-officers', function (req, res) {
  var email = req.session.data['email']
  var activeDirectors = req.session.data['active-directors']

  res.render('v12/confirmation-statement/active-officers', {
    scenario: req.session.scenario,
    email: email,
    activeDirectors: activeDirectors
  })
})

router.post('/v12/confirmation-statement/active-officers', function (req, res) {
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
    res.render('v12/confirmation-statement/active-officers', {
      scenario: req.session.scenario,
      activeDirectors: activeDirectors,
      errorList: errorList,
      activeDirectorsError: activeDirectorsError
    })
    } else {


  switch (activeDirectors) {
    case 'yes':
      res.redirect('/v12/confirmation-statement/officers')
      break
    case 'no':
      res.redirect('/v12/incorrect-information/wrong-active-officers')
      break
  }}
})



router.get('/v12/confirmation-statement/officers', function (req, res) {
  var email = req.session.data['email']
  var officers = req.session.data['officers']

  res.render('v12/confirmation-statement/officers', {
    email: email,
    scenario: req.session.scenario,
    officers: officers
  })
})

router.post('/v12/confirmation-statement/officers', function (req, res) {
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
    res.render('v12/confirmation-statement/officers', {
      scenario: req.session.scenario,
      officers: officers,
      errorList: errorList,
      directorDetailsError: directorDetailsError
    })
    } else {


  switch (officers) {
    case 'yes':
      res.redirect('/v12/task-list')
      break
    case 'no':
      res.redirect('/v12/incorrect-information/wrong-officers')
      break
  }}
})



router.get('/v12/confirmation-statement/additional-officers', function (req, res) {
  var email = req.session.data['email']
  var additionalDirectors = req.session.data['additional-directors']

  res.render('v12/confirmation-statement/additional-officers', {
    email: email,
    scenario: req.session.scenario,
    additionalDirectors: additionalDirectors
  })
})

router.post('/v12/confirmation-statement/additional-officers', function (req, res) {
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
    res.render('v12/confirmation-statement/additional-officers', {
      scenario: req.session.scenario,
      additionalDirectors: additionalDirectors,
      errorList: errorList,
      additionalDirectorsError: additionalDirectorsError
    })
    } else {


  switch (additionalDirectors) {
    case 'yes':
      res.redirect('/v12/incorrect-information/wrong-appoint-officers')
      break
    case 'no':
      res.redirect('/v12/task-list')
      break
  }}
})



router.get('/v12/confirmation-statement/officers-2', function (req, res) {
  var email = req.session.data['email']
  res.render('v12/confirmation-statement/officers-2', {
    scenario: req.session.scenario,
    email: email
  })
})

router.post('/v12/confirmation-statement/officers-2', function (req, res) {
  var officers = req.session.data['officers']

  switch (officers) {
    case 'yes':
      res.redirect('/v12/task-list')
      break
    case 'no':
      res.redirect('/v12/incorrect-information/wrong-officers')
      break
  }
})
router.get('/v12/incorrect-information/wrong-active-officers', function (req, res) {
  var email = req.session.data['email']
  res.render('v12/incorrect-information/wrong-active-officers', {
    scenario: req.session.scenario,
    email: email
  })
})



router.post('/v12/incorrect-information/wrong-active-officers', function (req, res) {
  res.redirect('/v12/task-list')
})
router.get('/v12/incorrect-information/wrong-officers', function (req, res) {
  var email = req.session.data['email']
  res.render('v12/incorrect-information/wrong-officers', {
    scenario: req.session.scenario,
    email: email
  })
})

router.post('/v12/incorrect-information/wrong-officers', function (req, res) {
  res.redirect('/v12/task-list')
})
router.get('/v12/incorrect-information/wrong-appoint-officers', function (req, res) {
  var email = req.session.data['email']
  res.render('v12/incorrect-information/wrong-appoint-officers', {
    scenario: req.session.scenario,
    email: email
  })
})



router.post('/v12/incorrect-information/wrong-appoint-officers', function (req, res) {
  res.redirect('/v12/task-list')
})
// members start //
router.get('/v12/confirmation-statement/active-members', function (req, res) {
  var email = req.session.data['email']
  var activeMembers = req.session.data['active-members']

  res.render('v12/confirmation-statement/active-members', {
    email: email,
    scenario: req.session.scenario,
    activeMembers: activeMembers
  })
})

router.post('/v12/confirmation-statement/active-members', function (req, res) {
  var activeMembers = req.session.data['active-members']

  switch (activeMembers) {
    case 'yes':
      res.redirect('/v12/confirmation-statement/members')
      break
    case 'no':
      res.redirect('/v12/incorrect-information/wrong-members')
      break
  }
})



router.get('/v12/confirmation-statement/members', function (req, res) {
  var members = req.session.data['members']
  var email = req.session.data.email

  res.render('v12/confirmation-statement/members', {
    scenario: req.session.scenario,
    email: email,
    members: members
  })
})

router.post('/v12/confirmation-statement/members', function (req, res) {
  var members = req.session.data['members']

  switch (members) {
    case 'yes':
      res.redirect('/v12/confirmation-statement/additional-members')
      break
    case 'no':
      res.redirect('/v12/incorrect-information/wrong-members')
      break
  }
})



router.get('/v12/confirmation-statement/additional-members', function (req, res) {
  var additionalMembers = req.session.data['additional-members']
  var email = req.session.data['email']

  res.render('v12/confirmation-statement/additional-members', {
    scenario: req.session.scenario,
    email: email,
    additionalMembers: additionalMembers
  })
})

router.post('/v12/confirmation-statement/additional-members', function (req, res) {
  var additionalMembers = req.session.data['additional-members']

  switch (additionalMembers) {
    case 'yes':
      res.redirect('/v12/incorrect-information/wrong-members')
      break
    case 'no':
      res.redirect('/v12/task-list')
      break
  }
})



router.get('/v12/incorrect-information/wrong-members', function (req, res) {
  var email = req.session.data['email']
  res.render('v12/incorrect-information/wrong-members', {
    scenario: req.session.scenario,
    email: email
  })
})

router.post('/v12/incorrect-information/wrong-members', function (req, res) {
  res.redirect('/v12/task-list')
})



// end of officers //
router.get('/v12/confirmation-statement/registers', function (req, res) {
  var email = req.session.data['email']
  var registers = req.session.data['registers']
  res.render('v12/confirmation-statement/registers', {
    scenario: req.session.scenario,
    email: email,
    registers: registers
  })
})

router.post('/v12/confirmation-statement/registers', function (req, res) {
  var registers = req.session.data['registers']
  var next = req.session.data['next']

if (next === true) {
  switch (registers) {
    case 'yes':
      res.redirect('/v12/task-list')
      break
    case 'no':
      res.redirect('/v12/incorrect-information/wrong-registers')
      break
    }
    } else {
      switch (registers) {
        case 'yes':
          res.redirect('/v12/task-list')
          break
        case 'no':
          res.redirect('/v12/incorrect-information/wrong-registers')
          break
        }
  }
})

router.get('/v12/incorrect-information/wrong-registers', function (req, res) {
  var email = req.session.data['email']
  res.render('v12/incorrect-information/wrong-registers', {
    scenario: req.session.scenario,
    email: email
  })
})

router.post('/v12/incorrect-information/wrong-registers', function (req, res) {
  res.redirect('/v12/task-list')
})



router.get('/v12/confirmation-statement/sic', function (req, res) {
  var email = req.session.data['email']
  var sic = req.session.data['sic']
  res.render('v12/confirmation-statement/sic', {
    scenario: req.session.scenario,
    sic: sic,
    email: email
  })
})

router.post('/v12/confirmation-statement/sic', function (req, res) {
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
    res.render('v12/confirmation-statement/sic', {
      scenario: req.session.scenario,
      sic: sic,
      errorList: errorList,
      sicError: sicError
    })
    } else {

  switch (sic) {
    case 'yes':
      res.redirect('/v12/task-list')
      break
    case 'no':
      res.redirect('/v12/incorrect-information/wrong-sic')
      break
  }}
})



router.get('/v12/incorrect-information/wrong-sic', function (req, res) {
  var email = req.session.data['email']
  res.render('v12/incorrect-information/wrong-sic', {
    scenario: req.session.scenario,
    email: email
  })
})

router.post('/v12/incorrect-information/wrong-sic', function (req, res) {
  res.redirect('/v12/task-list')
})
router.get('/v12/confirmation-statement/statement-of-capital', function (req, res) {
  var email = req.session.data['email']
  var statementOfCapital = req.session.data['statement-of-capital']
  res.render('v12/confirmation-statement/statement-of-capital', {
    scenario: req.session.scenario,
    email: email,
    statementOfCapital: statementOfCapital
  })
})



router.post('/v12/confirmation-statement/statement-of-capital', function (req, res) {
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
    res.render('v12/confirmation-statement/statement-of-capital', {
      scenario: req.session.scenario,
      statementOfCapital: statementOfCapital,
      errorList: errorList,
      statementOfCapitalError: statementOfCapitalError
    })
    } else {
  switch (statementOfCapital) {
    case 'yes':
      if (trading === 'yes') {
        res.redirect('/v12/task-list')
      } else {
        res.redirect('/v12/task-list')
      }
      break
    case 'no':
      res.redirect('/v12/incorrect-information/wrong-statement-of-capital')
      break
  }}
})

router.get('/v12/confirmation-statement/statement-of-capital-mismatch', function (req, res) {
  var email = req.session.data['email']
  var statementOfCapital = req.session.data['statement-of-capital']
  res.render('v12/confirmation-statement/statement-of-capital-mismatch', {
    scenario: req.session.scenario,
    email: email,
    statementOfCapital: statementOfCapital
  })
})



router.get('/v12/incorrect-information/wrong-statement-of-capital', function (req, res) {
  var email = req.session.data['email']
  res.render('v12/incorrect-information/wrong-statement-of-capital', {
    scenario: req.session.scenario,
    email: email
  })
})

router.post('/v12/incorrect-information/wrong-statement-of-capital', function (req, res) {
  res.redirect('/v12/task-list')
})



router.get('/v12/confirmation-statement/shareholders', function (req, res) {
  var email = req.session.data['email']
  res.render('v12/confirmation-statement/shareholders', {
    scenario: req.session.scenario,
    email: email
  })
})

router.post('/v12/confirmation-statement/shareholders', function (req, res) {
  var shareholders = req.session.data['shareholders']
  var tradingStatus = req.session.data['trading-status']

  switch (shareholders) {
    case 'yes':
      res.redirect('/v12/task-list')
      break
    case 'no':
      res.redirect('/v12/incorrect-information/wrong-shareholders')
      break
  }
})



router.get('/v12/confirmation-statement/shareholders-mismatch', function (req, res) {
  var email = req.session.data['email']
  res.render('v12/confirmation-statement/shareholders-mismatch', {
    scenario: req.session.scenario,
    email: email
  })
})

router.get('/v12/incorrect-information/wrong-shareholders', function (req, res) {
  var email = req.session.data['email']
  res.render('v12/incorrect-information/wrong-shareholders', {
    scenario: req.session.scenario,
    email: email
  })
})

router.post('/v12/incorrect-information/wrong-shareholders', function (req, res) {
  res.redirect('/v12/task-list')
})



router.get('/v12/psc-exemption', function (req, res) {
  var email = req.session.data['email']
  res.render('v12/psc-exemption', {
    scenario: req.session.scenario,
    email: email
  })
})

router.post('/v12/psc-exemption', function (req, res) {
  var exemption = req.session.data['exemption']

  switch (exemption) {
    case 'yes':
      res.redirect('/v12/psc-exempt-options')
      break
    case 'no':
      res.redirect('/v12/confirmation-statement/people-with-significant-control')
      break
  }
})



router.get('/v12/psc-exempt-options', function (req, res) {
  var email = req.session.data['email']
  res.render('v12/psc-exempt-options', {
    scenario: req.session.scenario,
    email: email
  })
})

router.post('/v12/psc-exempt-options', function (req, res) {
  res.redirect('/v12/task-list')
})



router.get('/v12/confirmation-statement/active-pscs', function (req, res) {
  var activePscs = req.session.data['active-pscs']
  var email = req.session.data['email']
  res.render('v12/confirmation-statement/active-pscs', {
    scenario: req.session.scenario,
    activePscs: activePscs,
    email: email
  })
})

router.post('/v12/confirmation-statement/active-pscs', function (req, res) {
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
    res.render('v12/confirmation-statement/active-pscs', {
      scenario: req.session.scenario,
      activePscs: activePscs,
      errorList: errorList,
      activePscsError: activePscsError
    })
    } else {


  switch (activePscs) {
    case 'yes':
      res.redirect('/v12/confirmation-statement/people-with-significant-control')
      break
    case 'no':
      res.redirect('/v12/incorrect-information/wrong-active-psc')
      break
  }}
})



router.get('/v12/incorrect-information/wrong-active-psc', function (req, res) {
  var email = req.session.data['email']
  res.render('v12/incorrect-information/wrong-active-psc', {
    scenario: req.session.scenario,
    email: email
  })
})

router.post('/v12/incorrect-information/wrong-active-psc', function (req, res) {
  res.redirect('/v12/task-list')
})



router.get('/v12/confirmation-statement/people-with-significant-control', function (req, res) {
  var psc = req.session.data['psc']
  var email = req.session.data['email']
  res.render('v12/confirmation-statement/people-with-significant-control', {
    scenario: req.session.scenario,
    psc: psc,
    email: email
  })
})

router.post('/v12/confirmation-statement/people-with-significant-control', function (req, res) {
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
    res.render('v12/confirmation-statement/people-with-significant-control', {
      scenario: req.session.scenario,
      psc: psc,
      errorList: errorList,
      pscDetailsError: pscDetailsError
    })
    } else {


  switch (psc) {
    case 'yes':
      res.redirect('/v12/confirmation-statement/psc-statement')
      break
    case 'no':
      res.redirect('/v12/incorrect-information/wrong-psc-details')
      break
  }}
})



router.get('/v12/confirmation-statement/additional-pscs', function (req, res) {
  var email = req.session.data['email']
  var additionalPscs = req.session.data['additional-pscs']
  res.render('v12/confirmation-statement/additional-pscs', {
    scenario: req.session.scenario,
    additionalPscs: additionalPscs,
    email: email
  })
})

router.post('/v12/confirmation-statement/additional-pscs', function (req, res) {
  var additionalPscs = req.session.data['additional-pscs']

  switch (additionalPscs) {
    case 'no':
      res.redirect('/v12/confirmation-statement/psc-statement')
      break
    case 'yes':
      res.redirect('/v12/incorrect-information/wrong-appoint-psc')
      break
  }
})



router.get('/v12/incorrect-information/wrong-appoint-psc', function (req, res) {
  var email = req.session.data['email']
  res.render('v12/incorrect-information/wrong-appoint-psc', {
    scenario: req.session.scenario,
    email: email
  })
})

router.post('/v12/incorrect-information/wrong-appoint-psc', function (req, res) {
  res.redirect('/v12/task-list')
})



router.get('/v12/incorrect-information/wrong-psc', function (req, res) {
  var email = req.session.data['email']
  res.render('v12/incorrect-information/wrong-psc', {
    scenario: req.session.scenario,
    email: email
  })
})

router.post('/v12/incorrect-information/wrong-psc', function (req, res) {
  res.redirect('/v12/task-list')
})



router.get('/v12/incorrect-information/wrong-psc-details', function (req, res) {
  var email = req.session.data['email']
  res.render('v12/incorrect-information/wrong-psc-details', {
    scenario: req.session.scenario,
    email: email
  })
})

router.post('/v12/incorrect-information/wrong-psc-details', function (req, res) {
  res.redirect('/v12/task-list')
})



router.get('/v12/confirmation-statement/psc-statement', function (req, res) {
  var pscStatement = req.session.data['psc-statement']
  var email = req.session.data['email']
  res.render('v12/confirmation-statement/psc-statement', {
    scenario: req.session.scenario,
    pscStatement: pscStatement,
    email: email
  })
})

router.post('/v12/confirmation-statement/psc-statement', function (req, res) {
  var pscStatement = req.session.data['psc-statement']

  switch (pscStatement) {
    case 'yes':
      res.redirect('/v12/task-list')
      break
    case 'no':
      res.redirect('/v12/incorrect-information/wrong-psc-details')
      break
  }
})



router.get('/v12/incorrect-information/wrong-psc-statement', function (req, res) {
  var email = req.session.data['email']
  res.render('v12/incorrect-information/wrong-psc-statement', {
    scenario: req.session.scenario,
    email: email
  })
})

router.post('/v12/incorrect-information/wrong-psc-statement', function (req, res) {
  res.redirect('/v12/task-list')
})



router.get('/v12/task-list-complete', function (req, res) {
  var completedTasks = req.session.data['completed']
  var exemption = req.session.data['exemption']
  var officers = req.session.data['officers']
  var psc = req.session.data['psc']
  var register = req.session.data['register']
  var ro = req.session.data['registered-office-address']

  res.render('v12/task-list-complete', {
    scenario: req.session.scenario,
    completedTasks: completedTasks,
    exemption: exemption,
    officers: officers,
    psc: psc,
    register: register,
    ro: ro
  })
})

router.post('/v12/task-list-complete', function (req, res) {
  res.redirect('/v12/confirmation-statement/review')
})



router.get('/v12/confirmation-statement/review', function (req, res) {
  var date = new Date()
  var exemption = req.session.data['exemption']
  var email = req.session.data['email']

  res.render('v12/confirmation-statement/review', {
    scenario: req.session.scenario,
    date: date,
    exemption: exemption,
    email: email
  })
})

router.get('/v12/print-confirmation-statement-review', function (req, res) {
  var date = new Date()
  var email = req.session.data['email']

  res.render('v12/print-confirmation-statement-review', {
    scenario: req.session.scenario,
    date: date,
    email: email
  })
})



router.get('/v12/review-payment', function (req, res) {
  var email = req.session.data['email']

  res.render('v12/review-payment', {
    scenario: req.session.scenario,
    email: email
  })
})

router.post('/v12/review-payment', function (req, res) {
  res.redirect('/v12/payment-options')
})



router.get('/v12/payment-options', function (req, res) {
  var email = req.session.data['email']
  res.render('v12/payment-options', {
    scenario: req.session.scenario,
    email: email
  })
})

router.post('/v12/payment-options', function (req, res) {
  var paymentOptions = req.session.data['payment-options']

  switch (paymentOptions) {
    case 'card':
      res.redirect('https://products.payments.service.gov.uk/pay/f90761a2258f4b60baa29f045cd78ca2')
      break
    case 'account':
      res.redirect('/v12/pay-by-account')
      break
  }
})



router.get('/v12/pay-by-account', function (req, res) {
  var email = req.session.data['email']
  res.render('v12/pay-by-account', {
    email: email
  })
})

router.post('/v12/pay-by-account', function (req, res) {
  res.redirect('/v12/confirmation')
})



router.get('/v12/confirmation', function (req, res) {
  var email = req.session.data.email
  var paymentOptions = req.session.data['payment-options']

  res.render('v12/confirmation', {
    scenario: req.session.scenario,
    email: email,
    paymentOptions: paymentOptions
  })
})