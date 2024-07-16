// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

// Route to build inventory by classification view
router.get('/login', utilities.handleErrors(accountController.buildLogin));

// Route to register view
router.get('/register', utilities.handleErrors(accountController.buildRegister));


// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Build account management view
router.get("/", utilities.handleErrors(accountController.buildManagement))

module.exports = router;