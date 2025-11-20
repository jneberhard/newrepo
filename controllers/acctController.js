const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs")

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

//deliver register view
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
async function registerAccount(req, res, next) {
  const { account_firstname, account_lastname, account_email, account_password } = req.body
// Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }   
    
    try {
        const regResult = await accountModel.registerAccount(
            account_firstname,
            account_lastname,
            account_email,
            hashedPassword
        );

    if (regResult) {
        req.flash("success", `Congratulations, you're registered ${account_firstname}. Please log in.`);
        res.redirect("/account/login");
        } else {
        req.flash("error", "Sorry, the registration failed.");
        res.redirect("/account/register");
        }
    } catch (error) {
        next(error);
    }
}


/* ****************************************
*  account login
* *************************************** */

async function loginAccount(req, res, next) {
  const { account_email, account_password } = req.body
  try {
    const accountData = await accountModel.checkExistingEmail(account_email)
    if (!accountData) {
      req.flash("error", "Invalid email or password.")
      return res.redirect("/account/login")
    }

    const match = await bcrypt.compare(account_password, accountData.account_password)
    if (match) {
      req.flash("success", "You are now logged in.")
      res.redirect("/account/")
    } else {
      req.flash("error", "Invalid email or password.")
      res.redirect("/account/login")
    }
  } catch (error) {
    next(error)
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, loginAccount };