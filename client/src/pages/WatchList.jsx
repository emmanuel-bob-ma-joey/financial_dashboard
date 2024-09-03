import React, { useState, useEffect } from "react";
import axios from "axios";
import { TiTimes } from "react-icons/ti";
import { auth } from "../firebase.js";
import { onAuthStateChanged } from "firebase/auth";
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
import { Header, Button } from "../components";

const WatchList = () => {
  const [update, setUpdate] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [stockInfo, setStockInfo] = useState([]);
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("user auth status has changed");
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = (row) => {
    const uid = user ? user.uid : "NULL";

    axios
      .delete("https://dashboard-backend-three-psi.vercel.app/api/watchlist", {
        headers: {},
        data: { stockSymbol: row.StockSymbol, user: uid },
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

  useEffect(() => {
    async function getStocks() {
      setLoading(true);
      const userid = user ? user.uid : "NULL";

      try {
        const response = await fetch(
          `https://dashboard-backend-three-psi.vercel.app/api/watchlist?user=${userid}`
        );

        if (!response.ok) {
          throw new Error(`An error occurred: ${response.statusText}`);
        }

        const stocks = await response.json();
        console.log(stocks);

        const stockInfoPromises = stocks.map((stock) =>
          axios.get(
            `https://dashboard-backend-three-psi.vercel.app/api/finance/quote/${stock["StockSymbol"]}`
          )
        );

        const stockInfoResponses = await Promise.all(stockInfoPromises);
        const stockInfo = stockInfoResponses.map((response) => response.data);

        setStocks(stocks);
        setStockInfo(stockInfo);
      } catch (error) {
        console.error("Error fetching stocks:", error);
        window.alert(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (update) {
      setUpdate(false);
    }

    getStocks();
  }, [update, user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const stockData = stocks.map((stock, index) => {
    const info = stockInfo[index] || {};
    return {
      StockName: stock.companyName,
      StockSymbol: stock.StockSymbol,
      Price: info.regularMarketPrice || "N/A",
      PercentageChange: info.regularMarketChangePercent
        ? info.regularMarketChangePercent.toFixed(2)
        : "N/A",
      DollarChange: info.regularMarketChange
        ? info.regularMarketChange.toFixed(2)
        : "N/A",
    };
  });

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl">
      <div>
        <Header category="page" title="My WatchList" />
      </div>
      <TableContainer component={Card}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">% change</TableCell>
              <TableCell align="right">$ change</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stockData.map((row) => (
              <TableRow
                key={row.StockSymbol}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.StockSymbol}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.StockName}
                </TableCell>
                <TableCell align="right" component="th" scope="row">
                  {row.Price}
                </TableCell>
                <TableCell
                  sx={{
                    color:
                      parseFloat(row.PercentageChange) > 0 ? "green" : "red",
                  }}
                  align="right"
                  component="th"
                  scope="row"
                >
                  {row.PercentageChange}
                </TableCell>
                <TableCell
                  sx={{
                    color: parseFloat(row.DollarChange) > 0 ? "green" : "red",
                  }}
                  align="right"
                >
                  {row.DollarChange}
                </TableCell>
                <TableCell align="right">
                  <button
                    className="p-1 hover:drop-shadow-xl"
                    onClick={() => handleDelete(row)}
                  >
                    <TiTimes size={28} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default WatchList;
