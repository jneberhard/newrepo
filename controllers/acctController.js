const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const accountValidate = require("../utilities/account-validation")


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
    hashedPassword = bcrypt.hashSync(account_password, 10)
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
  let nav = await utilities.getNav()
  req.flash("notice", 'Sorry, there was an error processing the registration.')
  res.status(500).render("account/register", {
    title: "Registration",
    nav,
    errors: null,
  })
}
}


/* ****************************************
*  account login
* *************************************** */

/*async function loginAccount(req, res, next) {
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
*/
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
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
*  Deliver account view
* *************************************** */
async function buildAccount(req, res, next) {
  let nav = await utilities.getNav()
  const accountData = res.locals.accountData
  res.render("account/account", {
    title: "Account",
    nav,
    errors: null,
    accountData: res.locals.accountData
  })
}

/* ****************************************
*  build update account view
* *************************************** */
async function buildUpdateAccount(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = parseInt(req.params.account_id)
  const accountData = await accountModel.getAccountById(account_id)
  res.render("account/update-account", {
    title: "Update Account",
    nav,
    errors: null,
    accountData
  })
}


/* ****************************************
*  Handle account update
* *************************************** */
async function updateAccount(req, res, next) {
  const account_id = parseInt(req.params.account_id)
  const { account_firstname, account_lastname, account_email } = req.body

  try {
    const updatedAccount = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email)
    if (updatedAccount) {
      delete updatedAccount.account_password
      const accessToken = jwt.sign(updatedAccount, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" })
      // Set cookie options based on environment - i was having issues with the name not changing when I changed names. I researched and found this could solve my problem.
      //https://nodejs.org/en/learn/getting-started/nodejs-the-difference-between-development-and-production
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      req.flash("success", "Account Updated Successfully.")
      res.redirect("/account/")
    } else {
      res.redirect(`/account/update/${account_id}`)
    }
  } catch (error) {
    console.error("Error updating account:", error)
    let nav = await utilities.getNav()
    res.status(500).render("account/update-account", {
      title: "Update Account",
      nav,
      errors: null,
      accountData: req.body
    })
  }
}



/* ****************************************
*  Handle password update
* *************************************** */
async function updatePassword(req, res, next) {
  const account_id = parseInt(req.params.account_id)
  const { account_password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)
    const updateResult = await accountModel.updatePassword(account_id, hashedPassword)

    if (updateResult) {
      req.flash("success", "Password updated successfully.")
      res.redirect("/account/")
    } else {
      req.flash("error", "Password update failed.")
      res.redirect(`/account/update/${account_id}`)
    }
  } catch (error) {
    console.error("Error updating password:", error)
    let nav = await utilities.getNav()
    res.status(500).render("account/update-account", {
      title: "Update Password",
      nav,
      errors: null,
      ...req.body,
    })
  }
}

/* ****************************************
*  Logout account
* *************************************** */
async function accountLogout(req, res, next) {
  try {
    res.clearCookie("jwt") // clear the JWT cookie
    if (req.session) {   // this is here because using express-session
        req.session.destroy(() => {
          return res.redirect("/account/login") 
        })
      } else {
        return res.redirect("/account/login")
      }
  } catch (error) {
    console.error("Error during logout:", error)
    res.redirect("/")
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccount, updatePassword, accountLogout, buildUpdateAccount, updateAccount }