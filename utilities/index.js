const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if (data == undefined){
    grid += '<p class="notice">Sorr                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           y, no matching vehicles could be found.</p>'
  }else{
    if(data.length > 0 ){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>' 
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
  }
  return grid
}

/* **************************************
* Build the country view HTML
* ************************************ */
Util.buildCountryGrid = async function(data){
  let grid
  if (data == undefined){
    grid += '<p class="notice">Sorr                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           y, no matching vehicles could be found.</p>'
  }else{
    if(data.length > 0 ){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="/../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>' 
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
  }
  return grid
}

/* ************************
 * Constructs the countries list
 ************************** */
Util.getCountry = async function (req, res, next) {
  let data = await invModel.getCountry()
  console.log(data)
  let list = "<ul>"
  //list += '<li><a href="/inv/type/country/all" title="All">All</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/country/' +
      row.country_id +
      '" title="See  ' +
      row.country_name +
      ' country">' +
      row.country_name +
      "</a>"
      ' "></a>'
    list += "</li>" 
  })
  list += "</ul>"
  return list;
}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log("getNav" + data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>" 
  })
  list += "</ul>"
  return list
}


/* ************************
 * Constructs the detailed view of the selected value
 ************************** */
Util.buildSingleView = async function (data) {
  //console.log(data);
  let grid
  if (data == undefined){
    grid += '<p class="notice">Sorry, page lost.</p>'
  }else{
    grid = '<div class="divdetail"><section id="inv-single">';
    grid +=
      "<h1>" + data.inv_make + " " + data.inv_model + "</h1>";
      grid += '<img src="' + data.inv_image + '" alt="' + data.inv_make + " " + data.inv_model + '" /></section>';
      grid += '<section id="inv-details">';
      grid += "<p>" + data.inv_description + "</p>";
      grid += '<p><span>Mileage:</span> ' + new Intl.NumberFormat('en-US', { maximumFractionDigits: 3}).format(data.inv_miles) + "</p>";
      grid += '<p><span>Price:</span> $' + new Intl.NumberFormat("en-US").format(data.inv_price) + "</p>";
      grid += '<p><span>Color:</span> ' + data.inv_color + "</p>";
      grid += '<p><span>Year:</span> ' + data.inv_year + "</p>";
      grid += '<p><span>Country:</span> ' + data.country_name + "</p>";
      grid += "</section></div>";
     // grid += "</section>";
      //console.log(grid);
  }
  return grid;
};

Util.buildClassificationList = async function (
  classification_id = null
) {
  try {
    let data = await invModel.getClassifications();
    let classificationList =
      '<select name="classification_id" id="classificationList" required>';
    classificationList += "<option value=''>Choose a Classification</option>";
    data.rows.forEach((row) => {
      classificationList += `<option value="${row.classification_id}"`;
      //console.log("row.classification_id: "+row.classification_id+" classification_id: "+classification_id)
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected ";
      }
      classificationList += `>${row.classification_name}</option>`;
    });
    classificationList += "</select>";
    return classificationList;
  } catch (error) {
    console.error("Error building classification dropdown:", error);
    throw error;
  }
};

Util.buildCountryList = async function (
  country_id = null
) {
  try {
    let data = await invModel.getCountry();
    let countryList =
      '<select name="country_id" id="countryList" required>';
      countryList += "<option value=''>Choose a Country</option>";
    data.rows.forEach((row) => {
      countryList += `<option value="${row.country_id}"`;
      //console.log("row.country_id: "+row.country_id+" country_id: "+country_id)
      if (
        countryList != null &&
        row.country_id == country_id
      ) {
        countryList += " selected ";
      }
      countryList += `>${row.country_name}</option>`;
    });
    countryList += "</select>";
    return countryList;
  } catch (error) {
    console.error("Error building country dropdown:", error);
    throw error;
  }
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 *  Route to inventory page
 * ************************************ */
Util.inventory = (req, res, next) => {
      next();
};

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

 /* ****************************************
 *  Check Admin and Employee
 * ************************************ */
Util.checkAdminEmployee = (req, res, next) => {
  if (res.locals.loggedin) {
    const account_type = res.locals.accountData.account_type;
    if (account_type == "Admin" || account_type == "Employee") {
      next();
    } else {
      req.flash(
        "notice",
        "Your account type does not have access for this page."
      );
      res.redirect("/account/login");
    }
  } else {
    req.flash("notice", "Your account type does not have access for this page.");
    res.redirect("/account/login");
  }
};

/* ****************************************
 * Build the reviews HTML for the management view
 **************************************** */
Util.buildAccountReviews = async function (reviewsData, res) {
 // console.log("reviewData: "+reviewsData)
  let reviews = "<ul class='reviewList'>";
  reviewsData.forEach((review) => {
    let screenName =
      res.locals.accountData.account_firstname[0] +
      " " +
      res.locals.accountData.account_lastname;
    let formattedDate = review.review_date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    reviews += "<li>";
    reviews += "<h3>" + screenName + " wrote on " + formattedDate + "</h3>";
    reviews += "<p>" + review.review_text + "</p>";

    // only difference *eyeroll* = edit and delete links
    reviews += '<a href="/account/editReview/' + review.review_id + '">| Edit |</a>';
    reviews += '<a href="/account/deleteReview/' + review.review_id + '"> Delete | </a>';

    reviews += "</li>";
  });
  reviews += "</ul>";
  return reviews;
}

module.exports = Util