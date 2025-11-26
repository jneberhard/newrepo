const pool = require("../database/")

/* **************
 *  Get all classification data
 * ************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get inventory details by inv_id
 * ************************** */
async function getVehicleById(inv_id) {
  try {
    const result = await pool.query(
      `SELECT * FROM public.inventory 
      WHERE inv_id = $1`,
      [inv_id]
    )
    return result.rows[0]
  } catch (error) {
    console.error("getvehiclebyid error " + error)
    throw error
  }
}

/* ***************************
 *  insert new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
    const data = await pool.query(sql, [classification_name])
    return data.rows[0]
  } catch (error) {
    throw error
  }
}

/* ***************************
 *  insert new inventory
 * ************************** */
async function addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
  try {
    const sql = `INSERT INTO public.inventory 
      (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`
    const data = await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
    return data.rows[0]
  } catch (error) {
    throw error
  }
}

/* ***************************
 *  update inventory
 * ************************** */
async function updateInventory(inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
  try {
    const sql =
      `UPDATE public.inventory
      SET inv_make = $2,
          inv_model = $3,
          inv_year = $4,
          inv_description = $5,
          inv_image = $6,
          inv_thumbnail = $7,
          inv_price = $8,
          inv_miles = $9,
          inv_color = $10,
          classification_id = $11
      WHERE inv_id = $1
      RETURNING *`
    const data = await pool.query(sql, [inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById, addClassification, addInventory, updateInventory};  //exporting the functions