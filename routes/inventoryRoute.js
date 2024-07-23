// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const managementValidate = require("../utilities/managementValidation")


// Route to build inventory by classification view
router.get('/', utilities.handleErrors(invController.buildManagementView));

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by country view
router.get("/type/country/:countryId", utilities.handleErrors(invController.buildByCountryId));

// Route to build single view for inventory item
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildSingleView));

// Route to build inventory by country view
router.get("/type/country/:countryId", utilities.handleErrors(invController.buildByCountryId));

// Route for new classification
router.get("/addClassification", utilities.inventory, utilities.handleErrors(invController.buildClassificationView));

// Route to process new classification
router.post("/addClassification", managementValidate.classificationRules(), managementValidate.checkClassificationName,
utilities.handleErrors(invController.processClassification));

// Route for new inventory
router.get("/addInventory", utilities.inventory, utilities.handleErrors(invController.buildInventoryView));

// Route to process new inventory
router.post("/addInventory", managementValidate.inventoryRules(), managementValidate.checkInventory, 
utilities.handleErrors(invController.processInventory)
);

// Route for editing inventory
router.get("/edit/:inventoryId", utilities.checkAdminEmployee, utilities.handleErrors(invController.editInventoryView));
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to process updated inventory
router.post(
    "/update/",
    managementValidate.inventoryRules(),
    managementValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)

// Route for getting the delete inventory view
router.get("/delete/:inventoryId", utilities.handleErrors(invController.buildDeleteInventoryView))

// Route to process the delete inventory
router.post("/delete/", utilities.handleErrors(invController.deleteInventory))

module.exports = router;

