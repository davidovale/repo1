const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const country = await utilities.getCountry()
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  try{
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
      country
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
      country: singleData.country_name,
      errors: null
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

  let classificationDropdown = await utilities.buildClassificationList();
  let countryDropdown = await utilities.buildCountryList();

  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationDropdown,
    errors: null,
    countryDropdown
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
 *  Build inventory by all countries view
 * ************************** */
invCont.buildByCountryId = async function (req, res, next) {
  const country_id = req.params.countryId
  const data = await invModel.getInventoryByCountryId(country_id)
  
  const grid = await utilities.buildCountryGrid(data)
  const country = await utilities.getCountry()
  const nav = await utilities.getNav()
  try{
    const className = data[0].country_name
      res.render("./inventory/classification", {
        title: className + " ",
        nav,
        grid,
        country
      })    
  }catch (error){
    let nav = await utilities.getNav();
      // If no items found, it shows the appropriate message
      res.render("error/error", {
          title: "Error",
          nav,
          grid,
          message: "<h2>Sorry, we appear to have lost that page.</h2>",});
  }
 
}

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
    let dropdown = await utilities.buildClassificationList();
    let dropdownCountry = await utilities.buildCountryList();

    res.render("./inventory/addInventory", {
      title: "Add Inventory",
      nav,
      dropdown: dropdown,
      dropdownCountry: dropdownCountry,
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

  const {inv_make,inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles,inv_color,country_id,classification_id} = req.body;

  let dropdown = await utilities.buildClassificationList(classification_id);
  let dropdownCountry = await utilities.buildCountryList(country_id);
  const inventoryResult = await invModel.addInventory(
    inv_make,inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles,inv_color,country_id,classification_id);
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
      dropdownCountry
    });
  } else {
    req.flash("notice", "Sorry, the inventory failed.");
    res.status(501).render("./inventory/addInventory", {
      title: "Add Inventory",
      nav,
      errors: null,
      dropdown,
      dropdownCountry
    });
  }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = req.params.inventoryId
  console.log("inventory_id: "+inv_id)
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  let dropdown = await utilities.buildClassificationList(
    itemData.classification_id
  );
  let dropdownCountry = await utilities.buildCountryList(
    itemData.country_id
  );
  console.log("itemData. inv_id: "+itemData.inv_id)
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    dropdown,
    dropdownCountry,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      country_id,
      classification_id,
      inventory_id
  } = req.body;

  const updateResult = await invModel.updateInventory(
    inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      country_id,
      classification_id,
      inventory_id
  );

  if (updateResult) {
    const itemName =
      updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const dropdown = await utilities.buildClassificationList(
      classification_id
    );
    const dropdownCountry = await utilities.buildCountryList(
      country_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      dropdown: dropdown,
      dropdownCountry: dropdownCountry,
      errors: null,
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
      inventory_id
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  console.log("classificação: "+classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  console.log("test inv_id"+invData[0].inv_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 * Build "Delete Inventory" View
 * ************************** */
invCont.buildDeleteInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const inventoryId = req.params.inventoryId;
  console.log("delete inventory_id: "+inventoryId)
  const itemData = await invModel.getInventoryById(inventoryId);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  let dropdown = await utilities.buildClassificationList(
    itemData.classification_id
  );
  res.render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    dropdown,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
    classification_id: itemData.classification_id,
  });
};

/* ***************************
 *  Delete Inventory
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { inv_make, inv_model, classification_id, inventory_id } =
    req.body;
    console.log("trying delete: "+inventory_id)
  const deleteResult = await invModel.deleteInventory(inventory_id);

  if (deleteResult) {
    const itemName = inv_make + " " + inv_model;
    req.flash("notice", `The ${itemName} was successfully deleted.`);
    res.redirect("/inv/");
  } else {
    const dropdown = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the delete failed.");
    res.status(501).render("inventory/deleteInventory", {
      title: "Delete " + itemName,
      nav,
      dropdown: dropdown,
      errors: null,
      inventory_id,
    });
  }
};


module.exports = invCont