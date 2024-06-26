const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build single view for inventory item
 * ************************** */
invCont.buildSingleView = async function (req, res, next) {
  const inventory_id = req.params.inventoryId;
  const singleData = await invModel.getInventoryById(inventory_id);
  let nav = await utilities.getNav();
  let singleView = await utilities.buildSingleView(singleData);
  res.render("./inventory/singleView", {
    title: singleData.inv_make + " " + singleData.inv_model,
    nav,
    singleView,
    errors: null,
  });
};

module.exports = invCont