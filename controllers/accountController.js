const utilities = require("../utilities/");
const accountModel = require("../models/account-model.js");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const { buildManagementView } = require("./invController.js");
require("dotenv").config()
const accountController = {};


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }

  /* ****************************************
*  Deliver registration view
* ******************************************/
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
 *  Process Registration
 * *************************************** */
accountController.registerAccount = async function (req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const registrationResult = await accountModel.submitAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (registrationResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    });
  }
};

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
  // regular password and cost (salt is generated automatically)
  hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
  )

  if (regResult) {
      req.flash(
          "notice",
          `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      );
          res.status(201).render("account/login", {
            title: "Login",
            nav,
          });
  } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Register",
        nav,
      });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

 async function accountLogout (req, res) {
  res.clearCookie("jwt");
  res.redirect("/");
};

 async function buildManagement (req, res) {
  let nav = await utilities.getNav();
  let reviewsData = await accountModel.getReviewsByAccountId(
    res.locals.accountData.account_id
  );
  //let reviews = await utilities.buildAccountReviews(reviewsData.rows, res);
  req.flash("notice", "You are logged in.")
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  });
};

async function buildEditAccountView (req, res) {
  let nav = await utilities.getNav();
  account_id = req.params.accountId;
  const accountData = await accountModel.getAccountById(account_id);
  res.render("account/editAccount", {
    title: "Edit Account",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
  });
};

/* ****************************************
 *  Process account data for update
 * *************************************** */
async function editAccount (req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
    account_id,
  } = req.body;
  const accountData = await accountModel.getAccountById(account_id);
  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  );

  if (updateResult) {
    req.flash(
      "notice",
      `Congratulations, ${account_firstname}. You have updated your account.`
    );
    res.clearCookie("jwt");
    const updatedAccountData = await accountModel.getAccountById(account_id);
    delete updatedAccountData.account_password;
    const accessToken = jwt.sign(
      updatedAccountData,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 3600 }
    );
    if (process.env.NODE_ENV === "development") {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
    } else {
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 3600 * 1000,
      });
    }
    res.status(201).redirect("/account/");
  } else {
    req.flash("notice", "Sorry, the account update failed.");
    res.status(501).render("account/editAccount", {
      title: "Edit Account",
      nav,
      errors: null,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
    });
  }
};

/* ****************************************
 *  Process password data for update
 * *************************************** */
 async function editPassword (req, res) {
  let nav = await utilities.getNav();
  const { account_id, account_password } = req.body;

  const accountData = await accountModel.getAccountById(account_id);

  const hashedPassword = bcrypt.hashSync(account_password, 10);

  const updateResult = await accountModel.updatePassword(
    account_id,
    hashedPassword
  );

  if (updateResult) {
    req.flash("notice", "Congratulations, your password has been updated.");
    res.status(201).render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the password update failed.");
    res.status(501).render("account/editAccount", {
      title: "Edit Account",
      nav,
      errors: null,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
    });
  }
};

/* ****************************************
 *  Process review edit
 * *************************************** */
async function editReview (req, res) {
  let nav = await utilities.getNav();
  const { review_id, review_text } = req.body;
  const reviewData = await accountModel.getReviewById(review_id);
  let review = reviewData.rows[0];
  let formattedDate = review.review_date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const updateResult = await accountModel.updateReview(review_id, review_text);

  if (updateResult) {
    req.flash("notice", "Congratulations, your review has been updated.");
    res.status(201).render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the review update failed.");
    res.status(501).render("account/editReview", {
      title:
        "Edit " +
        inventory.inventory_year +
        " " +
        inventory.inventory_make +
        " " +
        inventory.inventory_model +
        " Review",
      nav,
      formattedDate,
      errors: null,
    });
  }
};


  module.exports = {
    buildLogin, 
    buildRegister, 
    registerAccount,
    accountLogin,
    buildManagement,
    accountLogout,
    buildEditAccountView,
    editAccount,
    editPassword,
    editReview
  }