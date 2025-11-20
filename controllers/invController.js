const invModel = require("../models/inventory-model")  //imports the models
const utilities = require("../utilities/")

const invCont = {}    //intCont = short for inventoryController

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id) 
  if (!data || data.length === 0) {   //checking to make sure the classification ID (data) is valid, if not, throw 404 error.
    return next({
      status: 404,
      message: "Nothing found for this classification"
    })
  } 
    
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inv_id
  const vehicleData = await invModel.getVehicleById(inv_id)

  if (!vehicleData || vehicleData.length === 0 || !vehicleData.inv_id){  //checking to make sure the inv_id is valid. if not, throw the 404 error
    return next({
      status: 404,
      message: "Vehicle not found"
    })
  }

  const item = await utilities.buildInventoryView(vehicleData)
  const nav = await utilities.getNav()

  res.render("inventory/detail", {
    title: `${vehicleData.inv_year} ${vehicleData.inv_make} ${vehicleData.inv_model}`,
    nav,
    item,
  })
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/inv", {
    title: "Inventory Management",
    nav,
    errors: null,
  });
};



/* ***************************
 *  Build add new classification view
 * ************************** */
invCont.buildNewClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
    classification_name: ""
  });
}

/* ***************************
 *  new classification submission
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body
  try {
    const result = await invModel.addClassification(classification_name)
    if (result) {
      req.flash("success", "Classification added successfully.")
      res.redirect("/inv")
    } else {
      req.flash("error", "Failed to add classification.")
      res.redirect("/inv/add-classification")
    }
  } catch (error) {
    next(error)
  }
}



/* ***************************
 *  Build add new inventory view
 * ************************** */
invCont.buildNewInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
    errors: null,
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "",
    inv_thumbnail: "",
    inv_price: "",
    inv_miles: "",
    inv_color: "",
    classification_id: ""
  });
 }
  
/* ***************************
 *  Process new inventory submission
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  const {
    inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail,
    inv_price, inv_miles,
    inv_color, classification_id
  } = req.body

  try {
    const result = await invModel.addInventory(
      inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail,
    inv_price, inv_miles,
    inv_color, classification_id
    )

    if (result) {
      req.flash("success", "Vehicle added successfully.")
      res.redirect("/inv")
    } else {
      req.flash("error", "Failed to add vehicle.")
      res.redirect("/inv/add-inventory")
    }
  } catch (error) {
    next(error)
  }
}
  
  
 /* ***************************
 *  Purposely cause error --
 * ************************** */
invCont.causeError = (req, res, next) => {
  try {
    throw new Error("Intentional 500 error")
  } catch (error) {
    next(error);
  }
} 
  

module.exports = invCont  