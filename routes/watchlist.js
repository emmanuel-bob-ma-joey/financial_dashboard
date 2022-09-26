const express = require("express");
const watchlistRoutes = express.Router();
const dbo = require("../db/conn");
const yahooFinance = require("yahoo-finance2").default;

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// get list of stocks in watchlist
watchlistRoutes.route("/api/watchlist").get(async function (req, res) {
  const result = await yahooFinance.quote("AAPL");
  console.log(result);
  let db_connect = dbo.getDb("finance_dashboard");
  db_connect
    .collection("watchlist")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// post new stock to watchlist
watchlistRoutes.route("/api/watchlist").post(function (req, response) {
  let db_connect = dbo.getDb("finance_dashboard");
  let myobj = {
    StockSymbol: req.body.stockSymbol,
    companyName: req.body.companyName,
  };
  db_connect
    .collection("watchlist")
    .find({ StockSymbol: req.body.stockSymbol })
    .toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
      if (result.length == 0) {
        db_connect
          .collection("watchlist")
          .insertOne(myobj, function (err, res) {
            if (err) throw err;
            response.json(res);
          });
      }
    });
});

//remove a stock from watchlist
watchlistRoutes.route("/api/watchlist").delete((req, response) => {
  let db_connect = dbo.getDb("finance_dashboard");
  let myquery = { StockSymbol: req.body.StockSymbol };
  db_connect.collection("watchlist").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    response.json(obj);
  });
});

module.exports = watchlistRoutes;
