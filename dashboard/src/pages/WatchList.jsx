import React from "react";
import axios from "axios";
import { TiTimes } from "react-icons/ti";

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

  let stockData = [];

  const handleDelete = (row) => {
    console.log(row);
    //e.preventDefault();

    axios
      .delete("http://localhost:5000/watchlist", { headers: {}, data: row })
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
      const response = await fetch(`http://localhost:5000/watchlist/`);

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
            `http://localhost:5000/finance/quote/${stocks[i]["StockSymbol"]}`
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
  console.log(stockInfo);

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
                <TableCell align="right" component="th" scope="row">
                  {row.PercentageChange}
                </TableCell>
                <TableCell align="right">{row.DollarChange}</TableCell>
                <TableCell align="right">
                  <button
                    // aria-label="edit"
                    // text="Delete"
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
