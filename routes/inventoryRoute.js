// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")  //importing invController.js
const utilities = require("../utilities")
const invValidate = require("../utilities/account-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory  view
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInventoryId));

//Route to cause error --add router 
router.get("/500-error", invController.causeError);

// Route to build add Classification
router.get("/add-classification", utilities.handleErrors(invController.buildNewClassification));

//Route to build new Vehicle
router.get("/add-inventory", utilities.handleErrors(invController.buildNewInventory));

//Route to build Management view
router.get("/", utilities.handleErrors(invController.buildManagement));

//Process new classification submission
router.post("/add-classification", invValidate.classificationRules(),
    invValidate.checkClassificationData, utilities.handleErrors(invController.addClassification)
)

//Process new inventory (vehicle) submission
router.post("/add-inventory", invValidate.newInventoryRules(),
    invValidate.checkInvData, utilities.handleErrors(invController.addInventory)
)

module.exports = router;