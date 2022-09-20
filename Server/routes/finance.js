const express = require("express");
const financeRoutes = express.Router();
const dbo = require("../db/conn");
const yahooFinance = require("yahoo-finance2").default;

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// get list of stocks in watchlist
financeRoutes
  .route("/finance/quote/:stockSymbol")
  .get(async function (req, res) {
    const result = await yahooFinance.quote(req.params.stockSymbol);
    res.json(result);
  });

module.exports = financeRoutes;
