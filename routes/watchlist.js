import express from "express";
const watchlistRoutes = express.Router();
// const dbo = require("../db/conn");
import dbo from "../db/conn.js";
// const yahooFinance = require("yahoo-finance2").default;
import yahooFinance from "yahoo-finance2";
// This help convert the id from string to ObjectId for the _id.
// const ObjectId = require("mongodb").ObjectId;
import { ObjectId } from "mongodb";
// get list of stocks in watchlist
watchlistRoutes.route("/").get(async function (req, res) {
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
watchlistRoutes.route("/").post(function (req, response) {
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
watchlistRoutes.route("/").delete((req, response) => {
  let db_connect = dbo.getDb("finance_dashboard");
  let myquery = { StockSymbol: req.body.StockSymbol };
  db_connect.collection("watchlist").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    response.json(obj);
  });
});

// module.exports = watchlistRoutes;
export default watchlistRoutes;
