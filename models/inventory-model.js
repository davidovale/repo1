const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("select * from public.classification order by classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  console.log(classification_id);
  try {
    const data = await pool.query(
      `select * from public.inventory as inv join public.classification as cla 
      on inv.classification_id = cla.classification_id where inv.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get all inventory items and inventory_name by inventory_id
 * ************************** */
async function getInventoryById(inv_id) {
  try {
    const data = await pool.query(
      `select * from public.inventory as i where i.inv_id =  $1`,
      [inv_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getInventoryById error " + error);
  }
}

async function addClassification(classification_name) {
  try {
    const data = await pool.query(
      `INSERT INTO public.classification (classification_name) VALUES ($1)`,
      [classification_name]
    );
    return data;
  } catch (error) {
    console.error("addClassification error " + error);
  }
}

async function addInventory(
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql = `INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, 
    inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
    const inputList = [
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    ];
    console.log(inputList);
    const data = await pool.query(sql, inputList);
    return data;
  } catch (error) {
    console.error("addInventory error " + error);
  }
}



//module.exports = {getClassifications}
module.exports = {
  getClassifications, 
  getInventoryByClassificationId, 
  getInventoryById, 
  addClassification, 
  addInventory,
};
