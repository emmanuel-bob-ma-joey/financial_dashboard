const express = require("express");
const portfolioRoutes = express.Router();
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// get request for list of all stocks in portfolio
portfolioRoutes.route("/portfolio").get(function (req, res) {
  let db_connect = dbo.getDb("finance_dashboard");
  db_connect
    .collection("portfolio")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// post request to add a new stock to portfolio
portfolioRoutes.route("/portfolio").post(function (req, response) {
  let db_connect = dbo.getDb("finance_dashboard");
  let myobj = {
    StockSymbol: req.body.stockSymbol,
    companyName: req.body.companyName,
  };
  db_connect.collection("portfolio").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

//delete request to remove a stock from the portfolio
portfolioRoutes.route("/portfolio").delete((req, response) => {
  let db_connect = dbo.getDb("finance_dashboard");
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("portfolio").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    response.json(obj);
  });
});

module.exports = portfolioRoutes;
