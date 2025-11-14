const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>"
    list += "</li>"
    })
    list += "</ul>"
    return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid = ""
    if(data.length > 0){
        grid = '<ul id="inv-display">'  // id = inv-display
        data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'  // class="namePrice"
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
    })
    grid += '</ul>'
    } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* **************************************
* Build the inventory view HTML
* ************************************ */
Util.buildInventoryView = async function (vehicleData) {
    if (!vehicleData) {
        return '<p class="notice">Sorry, no matching vehicle could be found.</p>';
    }

    const item = ` <section class="details1">
        <div class="inventory-columns">
            <div class="inventory-detail">
                <h1>${vehicleData.inv_year} ${vehicleData.inv_make} ${vehicleData.inv_model}</h1>
                <img src="${vehicleData.inv_image}" alt="Image of ${vehicleData.inv_make} ${vehicleData.inv_model} on JNE Motors">
            </div>
            <div class="inventory-description">
                <h2>Price: $${new Intl.NumberFormat('en-US').format(vehicleData.inv_price)}</h2>
                <p>Year: ${vehicleData.inv_year}</p>
                <p>Make: ${vehicleData.inv_make}</p>
                <p>Model: ${vehicleData.inv_model}</p>
                <p>Mileage: ${new Intl.NumberFormat('en-US').format(vehicleData.inv_miles)}</p>
                <p>Color: ${vehicleData.inv_color}</p>
            </div>
        </div>
        </section>
        <div class="inventory-full-description">
            <p>${vehicleData.inv_description}</p>
        </div>
`;
    return item;
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util;