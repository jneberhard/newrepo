const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
  
/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registrationRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."), // on error this message is sent.
  
        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."), // on error this message is sent.
  
  
        // valid email is required and cannot already exist in the database
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("A valid email is required.")
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists) {
                    throw new Error("Email exists. Please log in or use different email")
                }
            }),

        // password is required and must be strong password
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ];
};
  

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        });
        return;
    }
    next();
};

/* ******************************
 * Validate login rules
 * ***************************** */
validate.loginRules = () => {
    return [
        body("account_email")
            .trim()
            .isEmail()
            .withMessage("Please enter a valid email address."),
        body("account_password")
            .trim()
            .notEmpty()
            .withMessage("Password is required")
    ];
};


/* ******************************
 * Check login data
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email
        });
        return;
    }
    next();
};

/* ******************************
 * Account update data validation rules
 * ***************************** */
validate.updateRules = () => {
    {
        return [
            // firstname is required and must be string     
            body("account_firstname")
                .trim()
                .escape()
                .notEmpty()
                .isLength({ min: 1 })
                .withMessage("Please provide a first name."), // on error this message is sent.    
            // lastname is required and must be string
            body("account_lastname")
                .trim()
                .escape()
                .notEmpty()
                .isLength({ min: 2 })
                .withMessage("Please provide a last name."), // on error this message is sent.
            // valid email is required
            body("account_email")
                .trim()
                .isEmail()
                .normalizeEmail()
                .withMessage("A valid email is required."),
        ];
    }
}
    
/* ******************************
 * check update data
 * ***************************** */    
validate.checkUpdateData = async (req, res, next) => {
    const errors = validationResult(req);  
    if (!errors.isEmpty()) {    
        let nav = await utilities.getNav();
        return res.render("account/update-account", {
            errors,
            title: "Update Account",
            nav,                
            ...req.body,
        });
    }
    next();
};
    
    
/* ******************************
 * Password validation rules
 * ***************************** */
validate.passwordRules = () => [
  body("account_password")
    .trim()
    .notEmpty()
    .isStrongPassword({
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Password does not meet requirements.")
]


    
/* ******************************
 * Password update data validation rules
 * ***************************** */
validate.checkPasswordData = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        return res.render("account/update-Password", {
            errors,
            title: "Update Passaword",
            nav,
            ...req.body,
        })
    }
    next();
};
/* ******************************
 * Check account ownership
 * ***************************** */
validate.checkOwnership = (req, res, next) => {
    try {
        const token = req.cookies.jwt
        if (!token) {
            req.flash("error", "You are not authorized to do this action")
            return res.redirect("/account/login")
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const loggedInId = decoded.account_id;
        const requestedId = parseInt(req.params.account_id);

        if (loggedInId !== requestedId) {
            req.flash("error", "You are not authorized to update this account.");
            return res.redirect("/account"); 
        }

        req.user = decoded;
        next()
    } catch (error) {
        console.error("Error checking account ownership:", error)
        req.flash("error", "Authentication failed. Please log in again.")
        return res.redirect("/account/login")
    }
};

module.exports = validate