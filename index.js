var inquirer = require("inquirer");
var Table = require('cli-table');
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root", //username
  password: "password", //password
  database: "bamazon_db"
});

//MAIN CHECK AND BUY FUNCTION WHICH DISPLAYS ALL ITEMS FROM MY SQL AND THEN ADDS FUNCTIONALITY TO BUY AN ITEM WITH QUANTITIY CHOICES.

var getProducts = function () {
  connection.query("Select * From Products", function (err, products) {

    var table = new Table({
      head: ["ID", "Product", "Department", "Price", "Stock Quantity"]
    })
    for (let i = 0; i < products.length; i++) {
      table.push([products[i].id, products[i].product_name, products[i].department_name, products[i].price, products[i].stock_quantity])

    }
    console.log(table.toString())
    checkAndBuy();
  })
};

function checkAndBuy() {
  inquirer
    .prompt({
      name: "id",
      type: "input",
      message: "What would you like to buy?"

    })
    .then(function (id) {
      inquirer
        .prompt({
          name: "quantity",
          type: "input",
          message: "How many would you like?"

        })
        .then(function (quantity) {
          // console.log(id)
          connection.query("Select * From Products Where id = ?", [id.id], function (err, product) {
            if (product[0].stock_quantity < quantity.quantity) {
              console.log("Sorry we are Currently out of that product Please try again")
              checkAndBuy();
            } else {
              let newQuantity = product[0].stock_quantity - quantity.quantity
              connection.query("Update Products SET stock_quantity = ? WHERE id = ?", [newQuantity, product[0].id], function (err, result) {
                getProducts();
              })
            }
          })

        });

    });
}

getProducts();