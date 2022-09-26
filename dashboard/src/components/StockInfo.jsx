import React from "react";
import axios from "axios";
import { LineChart, StockCard } from "../components";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  Button,
} from "@mui/material";

const StockInfo = ({ companyName, stockSymbol }) => {
  console.log(companyName);
  console.log(stockSymbol);
  const URL = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${stockSymbol.replace(
    /^/g,
    ""
  )}&apikey=Y0E17CDX4OXHO3V8`;
  const [financials, setFinancials] = React.useState(null);

  React.useEffect(() => {
    axios.get(URL).then((response) => {
      console.log(response.data);
      setFinancials(response.data);
    });
  }, []);

  if (!financials || Object.keys(financials).length == 0) return null;
  console.log(Object.keys(financials).length);

  let tableData = [];
  tableData.push({ stat: "EBIDTA", number: financials["EBITDA"] });
  tableData.push({
    stat: "Market Cap",
    number: financials["MarketCapitalization"],
  });
  tableData.push({ stat: "PE Ratio", number: financials["PERatio"] });
  tableData.push({ stat: "EPS", number: financials["EPS"] });
  tableData.push({ stat: "Revenue TTM", number: financials["RevenueTTM"] });
  tableData.push({
    stat: "Dividend Yield",
    number: `${financials["DividendYield"] * 100}%`,
  });
  tableData.push({ stat: "52 Week High", number: financials["52WeekHigh"] });
  tableData.push({ stat: "52 Week Low", number: financials["52WeekLow"] });

  const addToWatchList = async () => {
    console.log("Adding " + stockSymbol + " to watchlist");
    //e.preventDefault();

    const newStock = { stockSymbol: stockSymbol, companyName: companyName };
    console.log(newStock);

    await fetch("http://localhost:5000/watchlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newStock),
    }).catch((error) => {
      window.alert(error);
      return;
    });
  };

  const addToPortfolio = async () => {
    console.log("Adding " + stockSymbol + " to portfolio");

    const newStock = { stockSymbol: stockSymbol, companyName: companyName };
    console.log(newStock);

    await fetch("http://localhost:5000/portfolio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newStock),
    }).catch((error) => {
      window.alert(error);
      return;
    });
  };

  return (
    <div>
      {/* <Button
        color="white"
        bgColor="blue"
        text="add to watchlist"
        borderRadius="10px"
        size="md"
        onClick={addToWatchList}
      ></Button>
      <Button
        color="white"
        bgColor="blue"
        text="add to portfolio"
        borderRadius="10px"
        size="md"
        onClick={addToPortfolio}
      ></Button> */}
      <Button
        variant="outlined"
        target="_blank"
        onClick={addToPortfolio}
        sx={{ color: "blue" }}
        size="small"
      >
        add to portfolio
      </Button>
      <Button
        variant="outlined"
        target="_blank"
        onClick={addToWatchList}
        sx={{ color: "blue" }}
        size="small"
      >
        add to watchlist
      </Button>
      <StockCard stockSymbol={stockSymbol}></StockCard>
      <LineChart
        title={companyName}
        stockSymbol={stockSymbol}
        type="value"
      ></LineChart>
      <div>
        <TableContainer component={Card}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>(Financials)</TableCell>
                <TableCell align="right">(USD)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row) => (
                <TableRow
                  key={row.stat}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.stat}
                  </TableCell>
                  <TableCell align="right">{row.number}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div className="mt-12">
        <p>{financials["Description"]}</p>
      </div>
    </div>
  );
};

export default StockInfo;
