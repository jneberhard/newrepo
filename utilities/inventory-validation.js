const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}


/* ******************************
 * Validate new inventory rules
 * ***************************** */
validate.newInventoryRules = () => {
    return [
        // Make required
    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Make is required."),

    // Model required
    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Model is required."),

    // Year must be exactly 4 digits and numeric
    body("inv_year")
      .trim()
      .isLength({ min: 4, max: 4 })
      .withMessage("Year must be exactly 4 digits.")
      .isNumeric()
      .withMessage("Year must contain only numbers."),

    // Description required
    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required."),

    // Image required
    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image path is required."),

    // Thumbnail required
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required."),

    // Price - numeric and positive
    body("inv_price")
      .isNumeric()
      .withMessage("Price must be a number.")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),

    // Mileage - numeric and positive
    body("inv_miles")
      .isNumeric()
      .withMessage("Mileage must be a number.")
      .isInt({ min: 0 })
      .withMessage("Mileage must be a positive integer."),

    // Color required
    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Color is required."),

    // Classification ID must be numeric
    body("classification_id")
      .isNumeric()
      .withMessage("Classification ID must be a number.")
  ];
};

/* ******************************
 * Validate update inventory rules
 * ***************************** */
validate.updateInventoryRules = () => {
  return validate.newInventoryRules()
}

/* ******************************
 * Check inventory data
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        let classificationList = await utilities.buildClassificationList(req.body.classification_id)
        res.render("inventory/add-inventory", {
            title: "Add New Vehicle",
            nav,
            classificationList,
            errors,
            ...req.body,
        });
        return;
    }
    next();
};

/* ******************************
 * Check update data
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        let classificationList = await utilities.buildClassificationList(req.body.classification_id)
        const itemName = `${req.body.inv_make} ${req.body.inv_model}`
        res.render("inventory/edit-inventory", {
            errors,
            title: "Edit " + itemName,
            nav,
            classificationList,
            inv_id: req.body.inv_id,
            inv_make: req.body.inv_make,
            inv_model: req.body.inv_model,
            inv_year: req.body.inv_year,
            inv_description: req.body.inv_description,
            inv_image: req.body.inv_image,
            inv_thumbnail: req.body.inv_thumbnail,
            inv_price: req.body.inv_price,
            inv_miles: req.body.inv_miles,
            inv_color: req.body.inv_color,
            classification_id: req.body.classification_id
        })

        return;
    }
    next()
};


/* ******************************
 * Validate new classification rules
 * ***************************** */
validate.classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .notEmpty()
            .withMessage("Classification name is required.")
            .matches(/^[A-Za-z0-9]+$/)
            .withMessage("Classification name must contain only letters and numbers, with no spaces or special characters.")
    ]
}

/* ******************************
 * Check classification data
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors,
            classification_name: req.body.classification_name
        });
        return;
    }
    next();
};

module.exports = validate;