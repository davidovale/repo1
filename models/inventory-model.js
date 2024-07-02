const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `select * from public.inventory AS i 
      join public.classification as c 
      on i.classification_id = c.classification_id 
      where i.classification_id = $1`,
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




//module.exports = {getClassifications}
module.exports = {getClassifications, getInventoryByClassificationId, getInventoryById};
