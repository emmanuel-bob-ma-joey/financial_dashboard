const express = require("express");
const watchlistRoutes = express.Router();
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// get list of stocks in watchlist
watchlistRoutes.route("/watchlist").get(function (req, res) {
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
watchlistRoutes.route("/watchlist").post(function (req, response) {
  let db_connect = dbo.getDb("finance_dashboard");
  let myobj = {
    StockSymbol: req.body.stockSymbol,
    companyName: req.body.companyName,
  };
  db_connect.collection("watchlist").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

//remove a stock from watchlist
watchlistRoutes.route("/watchlist").delete((req, response) => {
  let db_connect = dbo.getDb("finance_dashboard");
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("watchlist").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    response.json(obj);
  });
});

module.exports = watchlistRoutes;
