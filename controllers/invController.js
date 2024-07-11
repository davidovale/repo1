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
  try{
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  }catch (error){
    let nav = await utilities.getNav();
      // If no items found, it shows the appropriate message
      res.render("error/error", {
          title: "Error",
          nav,
          message: "<h2>Sorry, we appear to have lost that page.</h2>",});
  }
 
}

/* ***************************
 *  Build single view for inventory item
 * ************************** */
invCont.buildSingleView = async function (req, res, next) {
  try{
    const inventory_id = req.params.inventoryId;
    const singleData = await invModel.getInventoryById(inventory_id);
    let nav = await utilities.getNav();
    let singleView = await utilities.buildSingleView(singleData);
    res.render("./inventory/singleView", {
      title: singleData.inv_make + " " + singleData.inv_model,
      nav,
      singleView,
      errors: null,
    })
  }catch (error){
    let nav = await utilities.getNav();
      // If no items found, it shows the appropriate message
      res.render("error/error", {
          title: "Error",
          nav,
          message: "<h2> - Sorry, we appear to have lost that page.</h2>",});
  }
}

/* ***************************
 *  Build management view for inventory
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  // const data = await invModel.getClassifications();
  let classificationDropdown = await utilities.buildClassificationDropdown();

  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationDropdown,
    errors: null,
  });
};

/* ***************************
 *  Build new classification view
 * ************************** */
invCont.buildClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/addClassification", {
    title: "Add New Classification",
    nav,
    errors: null,
  });
};

/* ***************************
 *  Process new classification
 * ************************** */
invCont.processClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;
  const classificationResult = await invModel.addClassification(
    classification_name
  );
  if (classificationResult) {
    req.flash("notice", `Classification ${classification_name} added.`);
    res.status(201).render("./inventory/addClassification", {
      title: "Add New Classification",
      nav,
      errors: null,
      classification_name,
    });
  } else {
    req.flash("notice", "Sorry, classification failed.");
    res.status(501).render("./inventory/addClassification", {
      title: "Add New Classification",
      nav,
      errors: null,
      classification_name,
    });
  }
};

/* ***************************
 *  Build new inventory view
 * ************************** */
invCont.buildInventoryView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    let dropdown = await utilities.buildClassificationDropdown();
    res.render("./inventory/addInventory", {
      title: "Add Inventory",
      nav,
      dropdown: dropdown,
      errors: null,
    });
  } catch (error) {
    console.error("Error building inventory view:", error);
    next(error);
  }
};

/* ***************************
 *  Process new inventory
 * ************************** */
invCont.processInventory = async function (req, res, next) {
  let nav = await utilities.getNav();

  const {inv_make,inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles,inv_color,classification_id} = req.body;

  let dropdown = await utilities.buildClassificationDropdown(classification_id);

  const inventoryResult = await invModel.addInventory(
    inv_make,inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles,inv_color,classification_id);
  if (inventoryResult) {
    req.flash(
      "notice",
      `Inventory ${inv_make} ${inv_model} added.`
    );
    res.status(201).render("./inventory/addInventory", {
      title: "Add Inventory",
      nav,
      errors: null,
      dropdown,
    });
  } else {
    req.flash("notice", "Sorry, the inventory failed.");
    res.status(501).render("./inventory/addInventory", {
      title: "Add Inventory",
      nav,
      errors: null,
      dropdown,
    });
  }
};


module.exports = invCont