import React from "react";
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
  }, []); // Empty dependency array means this effect runs once on mount

  const handleDelete = (row) => {
    console.log(row);
    //e.preventDefault();
    let uid = user ? user.uid : "NULL";

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

  React.useEffect(() => {
    async function getStocks() {
      let userid = user ? user.uid : "NULL";

      const response = await fetch(
        `https://dashboard-backend-three-psi.vercel.app/api/watchlist?user=${userid}`
      );

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const stocks = await response.json();
      console.log(stocks);

      for (let i = 0; i < stocks.length; i++) {
        console.log("making api call...");

        await axios
          .get(
            `https://dashboard-backend-three-psi.vercel.app/api/finance/quote/${stocks[i]["StockSymbol"]}`
          )
          .then((response) => {
            console.log(response);
            setStockInfo((oldArray) => [...oldArray, response.data]);
          });
      }

      setStocks(stocks);
    }

    if (update) {
      setUpdate(false);
    }

    getStocks();
  }, [update]);
  if (!stocks) return null;

  for (let i = 0; i < stocks.length; i++) {
    let temp = {};
    temp.StockName = stocks[i]["companyName"];
    temp.StockSymbol = stocks[i]["StockSymbol"];
    temp.Price = stockInfo[i]["regularMarketPrice"];
    temp.PercentageChange =
      stockInfo[i]["regularMarketChangePercent"].toFixed(2);
    temp.DollarChange = stockInfo[i]["regularMarketChange"].toFixed(2);

    stockData.push(temp);
  }

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
                {row.PercentageChange > 0 ? (
                  <TableCell
                    sx={{ color: "green" }}
                    align="right"
                    component="th"
                    scope="row"
                  >
                    {row.PercentageChange}
                  </TableCell>
                ) : (
                  <TableCell
                    sx={{ color: "red" }}
                    align="right"
                    component="th"
                    scope="row"
                  >
                    {row.PercentageChange}
                  </TableCell>
                )}
                {row.DollarChange > 0 ? (
                  <TableCell sx={{ color: "green" }} align="right">
                    {row.DollarChange}
                  </TableCell>
                ) : (
                  <TableCell sx={{ color: "red" }} align="right">
                    {row.DollarChange}
                  </TableCell>
                )}

                <TableCell align="right">
                  <button
                    className={` p-1 hover:drop-shadow-xl`}
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

      {/* <GridComponent id="gridComp" dataSource={stockData}>
        <ColumnsDirective>
          {ordersGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
      </GridComponent> */}
    </div>
  );
};

export default WatchList;
