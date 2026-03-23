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


// ******* sign-in javascript ********************************
router.get('/v13/sign-in', function (req, res) {
  // Set URl
  res.render('/v13/sign-in', {
    currentUrl: req.originalUrl
  })
})

router.post('/v13/sign-in', function (req, res) {
  res.redirect('/v13/company-number')
})


// ******* company-number javascript ********************************
router.get('/v13/company-number', function (req, res) {
  // Set URl
  res.render('/v13/company-number', {
    currentUrl: req.originalUrl
  })
})

router.post('/v13/company-number', function (req, res) {
  res.redirect('/v13/confirm-company')
})


// ******* confirm-company javascript ********************************
router.get('/v13/confirm-company', function (req, res) {
  // Set URl
  res.render('/v13/confirm-company', {
    currentUrl: req.originalUrl
  })
})

router.post('/v13/confirm-company', function (req, res) {
  res.redirect('/v13/authenticate')
})


// ******* authenticate javascript ********************************
router.get('/v13/authenticate', function (req, res) {
  // Set URl
  res.render('/v13/authenticate', {
    currentUrl: req.originalUrl
  })
})

router.post('/v13/authenticate', function (req, res) {
  res.redirect('/v13/check-trading-status')
})


// ******* task-list javascript ********************************
router.get('/v13//task-list', function (req, res) {
  var result = 0

  res.render('/v13/task-list', {
    result: result
  })
})


// ******* check-trading-status javascript ********************************
router.get('/v13/check-trading-status', function (req, res) {
  // Set URl
  res.render('/v13/check-trading-status', {
    currentUrl: req.originalUrl
  })
})

router.post('/v13/check-trading-status', function (req, res) {
  res.redirect('/v13/task-list')
})


// ******* confirmation-statement/sic javascript ********************************
router.get('/v13/confirmation-statement/sic', function (req, res) {
  // Set URl
  res.render('/v13/confirmation-statement/sic', {
    currentUrl: req.originalUrl
  })
})

router.post('/v13/confirmation-statement/sic', function (req, res) {
  res.redirect('/v13/task-list')
})


// ******* confirmation-statement/statement-of-capital javascript ********************************
router.get('/v13/confirmation-statement/statement-of-capital', function (req, res) {
  // Set URl
  res.render('/v13/confirmation-statement/statement-of-capital', {
    currentUrl: req.originalUrl
  })
})

router.post('/v13/confirmation-statement/statement-of-capital', function (req, res) {
  res.redirect('/v13/task-list')
})


// ******* confirmation-statement/officers javascript ********************************
router.get('/v13/confirmation-statement/officers', function (req, res) {
  // Set URl
  res.render('/v13/confirmation-statement/officers', {
    currentUrl: req.originalUrl
  })
})

router.post('/v13/confirmation-statement/officers', function (req, res) {
  res.redirect('/v13/task-list')
})


// ******* confirmation-statement/shareholders javascript ********************************
router.get('/v13/confirmation-statement/shareholders', function (req, res) {
  // Set URl
  res.render('/v13/confirmation-statement/shareholders', {
    currentUrl: req.originalUrl
  })
})

router.post('/v13/confirmation-statement/shareholders', function (req, res) {
  res.redirect('/v13/task-list')
})


// ******* confirmation-statement/people-with-significant-control javascript ********************************
router.get('/v13/confirmation-statement/people-with-significant-control', function (req, res) {
  // Set URl
  res.render('/v13/confirmation-statement/people-with-significant-control', {
    currentUrl: req.originalUrl
  })
})

router.post('/v13/confirmation-statement/people-with-significant-control', function (req, res) {
  res.redirect('/v13/task-list')
})


// ******* confirmation-statement/ro javascript ********************************
router.get('/v13/confirmation-statement/ro', function (req, res) {
  // Set URl
  res.render('/v13/confirmation-statement/ro', {
    currentUrl: req.originalUrl
  })
})

router.post('/v13/confirmation-statement/ro', function (req, res) {
  res.redirect('/v13/task-list')
})


// ******* confirmation-statement/registers javascript ********************************
router.get('/v13/confirmation-statement/registers', function (req, res) {
  // Set URl
  res.render('/v13/confirmation-statement/registers', {
    currentUrl: req.originalUrl
  })
})

router.post('/v13/confirmation-statement/registers', function (req, res) {
  res.redirect('/v13/task-list')
})


// ******* review javascript ********************************
router.get('/v13/confirmation-statement/review', function (req, res) {
  // Set URl
  res.render('/v13/confirmation-statement/review', {
    currentUrl: req.originalUrl
  })
})

router.post('/v13/confirmation-statement/review', function (req, res) {
  res.redirect('/v13/review-payment')
})


// ******* review-payment javascript ********************************
router.get('/v13/review-payment', function (req, res) {
  // Set URl
  res.render('/v13/review-payment', {
    currentUrl: req.originalUrl
  })
})

router.post('/v13/review-payment', function (req, res) {
  res.redirect('/v13/payment-options')
})





