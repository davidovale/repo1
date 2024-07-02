/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static.js")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute.js")
const errorRoute = require("./routes/errorRoute")
const utilities = require("./utilities/index")


/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root


app.use(static)

//Index route
//app.get("/", function(req, res){
//  res.render("index", {title: "Home"})
//})
app.get("/", baseController.buildHome)

// Inventory routes
app.use("/inv", inventoryRoute)

// Intentional Error route
app.use('/error', utilities.handleErrors(errorRoute))


/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
/*
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ 
    message = err.message
  } else {
    message = 'Oh no! There was a crash :('
  }
  res.render("error/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})
  */

app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  console.error(err.stack);  // Print stack trace for debugging
  let message = '';
  if (err.status === 404) { 
      message = err.message;
      res.status(404).render("error/error", {
          title: '404 - Not Found',
          message,
          nav
      });
  } else {
      message = '<h1>Oh no!</h1> <p>There was a crash. Maybe try a different route?</p>';
      res.status(500).render("error/error", {
          title: 'Server Error',
          message,
          nav
      });
  }
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})