// const express = require("express");
import express from "express";
const financeRoutes = express.Router();
//const dbo = require("../db/conn");
//import dbo from "../db/conn";
import dbo from "../db/conn.js";
// const yahooFinance = require("yahoo-finance2").default;
import yahooFinance from "yahoo-finance2";

// This help convert the id from string to ObjectId for the _id.
// const ObjectId = require("mongodb").ObjectId;
import { ObjectId } from "mongodb";

// get list of stocks in watchlist
financeRoutes.route("/quote/:stockSymbol").get(async function (req, res) {
  console.log("requesting quote for", req.params.stockSymbol);

  const result = await yahooFinance.quote(req.params.stockSymbol);
  res.json(result);
});

financeRoutes.route("/trending").get(async function (req, res) {
  const queryOptions = { count: 5, lang: "en-US" };
  const result = await yahooFinance.trendingSymbols("CA", queryOptions);
  res.json(result);
});

financeRoutes.route("/recommended/").get(async function (req, res) {
  console.log("this is stock symbols " + req.query.stockSymbols);
  const result = await yahooFinance.recommendationsBySymbol(
    req.query.stockSymbols
  );
  res.json(result);
});

//module.exports = financeRoutes;
export default financeRoutes;
