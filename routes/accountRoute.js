// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accController = require("../controllers/accountController")
const utilities = require("../utilities")

router.get('/login', utilities.handleErrors(accountController.buildLogin));

module.exports = router;