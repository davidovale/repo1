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

// Route to build single view for inventory item
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildSingleView));

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


module.exports = router;

