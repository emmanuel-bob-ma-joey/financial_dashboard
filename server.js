// const express = require("express");
// require("dotenv").config();

// const app = express();
// const cors = require("cors");
// const path = require("path");
// const financeRouter = require("./routes/finance");
// const portfolioRouter = require("./routes/portfolio");
// const watchlistRouter = require("./routes/watchlist");
// // require("dotenv").config({ path: "./config.env" });

// const port = process.env.PORT || 5000;
// app.use(cors());
// app.use(express.json());

// app.use("/api/portfolio", portfolioRouter);
// app.use("/api/watchlist", watchlistRouter);
// app.use("/api/finance", financeRouter);
// app.use(express.static(path.join(__dirname, "client", "build")));
// // get driver connection
// const dbo = require("./db/conn");

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "client", "build", "index.html"));
// });

// app.listen(port, () => {
//   // perform a database connection when server starts
//   dbo.connectToServer(function (err) {
//     if (err) console.error(err);
//   });
//   console.log(`Server is running on port: ${port}`);
// });

import express from "express";
import dotenv from "dotenv";
dotenv.config();
// require("dotenv").config();
const app = express();
import cors from "cors";
// import path from "path";
import financeRouter from "./routes/finance.js";
import portfolioRouter from "./routes/portfolio.js";
import watchlistRouter from "./routes/watchlist.js";
// dotenv.config({ path: "./config.env" });

import path from "path";
import { fileURLToPath } from "url";

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.use("/api/portfolio", portfolioRouter);
app.use("/api/watchlist", watchlistRouter);
app.use("/api/finance", financeRouter);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "client", "build")));
//app.use(express.static(path.join(__dirname, "client", "build")));
// get driver connection
import dbo from "./db/conn.js";

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${port}`);
});
