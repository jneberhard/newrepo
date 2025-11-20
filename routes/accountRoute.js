// Needed Resources 
const express = require("express")
const router = express.Router()
const acctController = require("../controllers/acctController") 
const regValidate = require('../utilities/account-validation')

const utilities = require("../utilities")

//route for login view
router.get("/login", utilities.handleErrors(acctController.buildLogin));

//route for registration view
router.get("/register", utilities.handleErrors(acctController.buildRegister));

// route for the registration
router.post("/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(acctController.registerAccount))

//Process the login attempt
router.post("/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(acctController.loginAccount)
    );



 /*   router.post(
  "/login",
  regValidate.loginRules(),      // this one IS called (returns an array)
  regValidate.checkLoginData,    // this one is NOT called
  (req, res) => {
    res.status(200).send("login process")
  }
)*/
module.exports = router;  