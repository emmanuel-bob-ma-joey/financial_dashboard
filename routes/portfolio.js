const express = require("express");
const portfolioRoutes = express.Router();
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// get request for list of all stocks in portfolio
portfolioRoutes.route("/").get(function (req, res) {
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
portfolioRoutes.route("/").post(function (req, response) {
  let db_connect = dbo.getDb("finance_dashboard");
  let myobj = {
    StockSymbol: req.body.stockSymbol,
    companyName: req.body.companyName,
    shares: 0,
    bookValue: 0,
  };
  db_connect
    .collection("portfolio")
    .find({ StockSymbol: req.body.stockSymbol })
    .toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
      if (result.length == 0) {
        db_connect
          .collection("portfolio")
          .insertOne(myobj, function (err, res) {
            if (err) throw err;
            response.json(res);
          });
      }
    });
});

//delete request to remove a stock from the portfolio
portfolioRoutes.route("/").delete((req, response) => {
  let db_connect = dbo.getDb("finance_dashboard");
  let myquery = { StockSymbol: req.body.StockSymbol };
  db_connect.collection("portfolio").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    response.json(obj);
  });
});

//update the number of shares in a stock
portfolioRoutes.route("/:stockSymbol").post(function (req, response) {
  let db_connect = dbo.getDb("finance_dashboard");
  let myquery = { StockSymbol: req.params.stockSymbol };
  let newvalues = {
    $inc: {
      shares: req.body.shares,
      bookValue: req.body.shares * req.body.bookValue,
    },
  };
  db_connect
    .collection("portfolio")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      response.json(res);
    });
});

module.exports = portfolioRoutes;
