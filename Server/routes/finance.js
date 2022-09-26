const express = require("express");
const financeRoutes = express.Router();
const dbo = require("../db/conn");
const yahooFinance = require("yahoo-finance2").default;
var googleFinance = require("google-finance");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// get list of stocks in watchlist
financeRoutes
  .route("/finance/quote/:stockSymbol")
  .get(async function (req, res) {
    const result = await yahooFinance.quote(req.params.stockSymbol);
    res.json(result);
  });

financeRoutes.route("/finance/trending").get(async function (req, res) {
  const queryOptions = { count: 5, lang: "en-US" };
  const result = await yahooFinance.trendingSymbols("CA", queryOptions);
  res.json(result);
});

financeRoutes.route("/finance/recommended/").get(async function (req, res) {
  console.log("this is stock symbols " + req.query.stockSymbols);
  const result = await yahooFinance.recommendationsBySymbol(
    req.query.stockSymbols
  );
  res.json(result);
});

module.exports = financeRoutes;
