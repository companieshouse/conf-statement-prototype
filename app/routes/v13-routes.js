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



