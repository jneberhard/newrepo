// Needed Resources 
const express = require("express")
const router = express.Router()
const acctController = require("../controllers/acctController") 
const regValidate = require('../utilities/account-validation')
const utilities = require("../utilities")

console.log("acctController keys:", Object.keys(acctController));

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
    utilities.handleErrors(acctController.accountLogin)
    );

//route for account view
router.get("/", utilities.checkLogin, utilities.handleErrors(acctController.buildAccount));

//route for update account and update password view
router.get("/update/:account_id",  utilities.checkLogin, regValidate.checkOwnership, utilities.handleErrors(acctController.buildUpdateAccount));
router.post("/update/:account_id", utilities.checkLogin, regValidate.checkOwnership, regValidate.updateRules(), regValidate.checkUpdateData, utilities.handleErrors(acctController.updateAccount));
router.post("/update-password/:account_id", utilities.checkLogin, regValidate.checkOwnership, regValidate.passwordRules(), regValidate.checkPasswordData, utilities.handleErrors(acctController.updatePassword))
  
//route for logout
router.get("/logout", utilities.handleErrors(acctController.accountLogout));



module.exports = router; 