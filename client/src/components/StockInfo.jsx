import React from "react";
import axios from "axios";
import { LineChart, StockCard } from "../components";
import { useNavigate } from "react-router-dom";
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
import { auth } from "../firebase.js";

const StockInfo = ({ companyName, stockSymbol }) => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(auth.currentUser);

  React.useEffect(() => {
    // This listener is called whenever the user's sign-in state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser); // Update your state with the new user
      console.log("user auth status has changed");
    });
    return () => unsubscribe();
  }, []);

  const URL = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${stockSymbol.replace(
    /^/g,
    ""
  )}&apikey=${process.env.API_KEY}`;
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
    console.log("Adding " + stockSymbol + " to " + user + " watchlist");
    const userid = user ? user.uid : "NULL";

    const newStock = {
      stockSymbol: stockSymbol,
      companyName: companyName,
      uid: userid,
      buyPrice: 0,
      sellPrice: 0,
      buyDays: 0,
      sellDays: 0,
    };
    console.log(newStock);

    await fetch(
      "https://dashboard-backend-three-psi.vercel.app/api/watchlist",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStock),
      }
    ).catch((error) => {
      window.alert(error);
      return;
    });
  };

  const addToPortfolio = async () => {
    const userid = user ? user.uid : "NULL";
    // console.log("Adding " + stockSymbol + " to " + userid + " portfolio");
    const newStock = {
      stockSymbol: stockSymbol,
      companyName: companyName,
      uid: userid,
      shares: 0,
      bookValue: 0,
      buyPrice: 0,
      sellPrice: 0,
      buyDays: 0,
      sellDays: 0,
    };
    console.log(newStock);

    await fetch(
      "https://dashboard-backend-three-psi.vercel.app/api/portfolio",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStock),
      }
    )
      .then((response) => {
        navigate("/portfolio");
      })
      .catch((error) => {
        window.alert(error);
        return;
      });
  };

  return (
    <div>
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
