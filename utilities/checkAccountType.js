const jwt = require("jsonwebtoken")
const utilities = require("../utilities")

//middleware to check account type
const checkAccountType = async (req, res, next) => {
     try {
        const token = req.cookies.jwt
        if (!token) {
            let nav = await utilities.getNav()
            req.flash("notice", "You must be logged in to view page.")
            return res.status(401).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email: "",
            })
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        if (decoded.account_type === "Employee" || decoded.account_type === "Admin") {
            next()
        } else {
            let nav = await utilities.getNav()
            req.flash("notice", "You do not have permission to view this.")
            return res.status(403).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email: "",
            })
        }
    } catch (error) {
        console.error("Error checking account type:", error)
        let nav = await utilities.getNav()
        req.flash("notice", "Authentication failed. Login again.")
        return res.status(401).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email: "",
        })
    }
}

module.exports = checkAccountType