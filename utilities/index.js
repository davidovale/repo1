const invModel = require("../models/inventory-model")
const Util = {}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
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

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  //console.log(data)
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

Util.buildSingleView = async function (data) {
  //console.log("information: ",data);
  let grid
  
  grid = '<section id="inv-single">';
  grid +=
    "<h1>" + data.inv_make + " " + data.inv_model + "</h1>";
    grid +=
    '<img src="' +
    data.inv_image +
    '" alt="' +
    data.inv_make +
    " " +
    data.inv_model +
    '" />';
    grid += '<section id="inv-details">';
    grid += "<p>" + data.inv_description + "</p>";
    grid +=
    '<p><span class="bold">Price:</span> $' +
    new Intl.NumberFormat("en-US").format(data.inv_price) +
    "</p>";
    grid +=
    '<p><span class="bold">Color:</span> ' + data.inv_color + "</p>";
    grid +=
    '<p><span class="bold">Year:</span> ' + data.inv_year + "</p>";
    grid += "</section>";
    grid += "</section>";
    console.log(grid);
  return grid;
};

module.exports = Util