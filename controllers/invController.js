const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  if (!data || data.length === 0) {
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

  if (!vehicleData || vehicleData.length === 0 || !vehicleData.inv_id){
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
 *  Purposely cause error
 * ************************** */
invCont.causeError = (req, res, next) => {
  try {
    throw new Error("Intentional 500 error")
  } catch (error) {
    next(error);
  }
}

module.exports = invCont