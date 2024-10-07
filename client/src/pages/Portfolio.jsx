import React from "react";
import axios from "axios";
import { TiTimes } from "react-icons/ti";
import { Link, NavLink } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
} from "@mui/material";
import { Header, Button, TableEntry } from "../components";
import { auth } from "../firebase.js";

const Portfolio = () => {
  const [update, setUpdate] = React.useState(false);
  const [stocks, setStocks] = React.useState([]);
  const [stockInfo, setStockInfo] = React.useState([]);
  const [user, setUser] = React.useState(auth.currentUser);
  let stockData = [];

  React.useEffect(() => {
    // This listener is called whenever the user's sign-in state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser); // Update your state with the new user
      console.log("user auth status has changed");
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleDelete = (row) => {
    console.log(row);
    //e.preventDefault();

    if (user) {
      row.uid = user.uid;
    } else {
      row.uid = "NULL";
    }

    axios
      .delete("https://dashboard-backend-three-psi.vercel.app/api/portfolio", {
        headers: {},
        data: row,
      })
      .then(
        (response) => {
          console.log(response);
          setUpdate(true);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  React.useEffect(() => {
    async function getStocks() {
      console.log("getting portfolio");
      let userid = "NULL";
      if (user) {
        userid = user.uid;
      }
      console.log("the userid is", userid);
      const response = await fetch(
        `https://dashboard-backend-three-psi.vercel.app/api/portfolio?user=${userid}`
      );

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      } else {
        console.log("this is the portfolio response:", response);
      }

      const stocks = await response.json();
      for (let i = 0; i < stocks.length; i++) {
        console.log("making api call...");
        console.log(stocks[i]);

        await axios
          .get(
            `https://dashboard-backend-three-psi.vercel.app/api/finance/quote/${stocks[i]["StockSymbol"]}`
          )
          .then((response) => {
            console.log(response.data);
            setStockInfo((oldArray) => [...oldArray, response.data]);
          });
      }

      setStocks(stocks);
    }

    if (update) {
      setUpdate(false);
    }

    getStocks();
  }, [update, user]);
  if (!stocks) return null;

  let fail = false;

  if (fail) {
    return (
      <p>Unable to load due to API limit, please try again in a few seconds.</p>
    );
  }
  const partitionAndSortStocks = (stockData) => {
    const buyStocks = stockData.filter((stock) => stock.buySellZone === "Buy");
    buyStocks.sort((a, b) => b.buySellZonePercent - a.buySellZonePercent);
    const sellStocks = stockData.filter(
      (stock) => stock.buySellZone === "Sell"
    );
    sellStocks.sort((a, b) => b.buySellZonePercent - a.buySellZonePercent);
    const holdStocks = stockData.filter(
      (stock) => stock.buySellZone === "Hold"
    );
    holdStocks.sort((a, b) => b.buySellZonePercent - a.buySellZonePercent);
    return [...buyStocks, ...sellStocks, ...holdStocks];
  };

  for (let i = 0; i < stocks.length; i++) {
    let temp = {};
    temp.StockName = stocks[i]["companyName"];
    temp.StockSymbol = stocks[i]["StockSymbol"];
    temp.shares = stocks[i]["shares"];
    temp.Price = stockInfo[i]["regularMarketPrice"];
    temp.PercentageChange =
      stockInfo[i]["regularMarketChangePercent"].toFixed(2);
    temp.DollarChange = stockInfo[i]["regularMarketChange"].toFixed(2);
    temp.sellPrice = stocks[i]["sellPrice"];
    temp.buyPrice = stocks[i]["buyPrice"];
    temp.buyDays = stocks[i]["buyDays"];
    temp.sellDays = stocks[i]["sellDays"];

    if (temp.Price > temp.sellPrice) {
      temp.buySellZonePercent =
        ((temp.Price - temp.sellPrice).toFixed(2) / temp.Price) * 100;
      temp.buySellZone = "Sell";
    } else if (temp.Price < temp.buyPrice) {
      temp.buySellZonePercent =
        ((temp.buyPrice - temp.Price).toFixed(2) / temp.Price) * 100;
      temp.buySellZone = "Buy";
    } else {
      temp.buySellZone = "Hold";
      temp.buySellZonePercent = 0;
    }
    stockData.push(temp);
  }

  stockData = partitionAndSortStocks(stockData);

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl">
      <div>
        <Header category="page" title="My Portfolio" />
      </div>
      <TableContainer component={Card}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Symbol</TableCell>
              {/* <TableCell>Company Name</TableCell> */}
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Shares</TableCell>
              <TableCell align="right">% change</TableCell>
              <TableCell align="right">dollar change</TableCell>
              <TableCell align="right">Buy Price</TableCell>
              <TableCell align="right">Sell Price</TableCell>
              <TableCell align="right">Buy Days</TableCell>
              <TableCell align="right">Sell Days</TableCell>
              <TableCell align="right">Buy/Sell zone</TableCell>
              <TableCell align="right">Days in zone</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stockData.map((row) => (
              <TableEntry
                row={row}
                handleDelete={handleDelete}
                update={setUpdate}
                key={row.StockSymbol}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Portfolio;
