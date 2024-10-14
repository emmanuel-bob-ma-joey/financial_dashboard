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
  const [tableData, setTableData] = React.useState([]);
  const relevantKeys = [
    "region",
    "quoteType",
    "shortName",
    "regularMarketDayHigh",
    "regularMarketDayLow",
    "regularMarketVolume",
    "trailingPE",
    "forwardPE",
    "marketCap",
    "priceToBook",
    "averageAnalystRating",
  ];
  // const [financials, setFinancials] = React.useState(null);
  console.log(companyName, stockSymbol);

  React.useEffect(() => {
    // This listener is called whenever the user's sign-in state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser); // Update your state with the new user
    });
    return () => unsubscribe();
  }, []);

  const URL = `https://dashboard-backend-three-psi.vercel.app/api/finance/quote/${stockSymbol.replace(
    /^/g,
    ""
  )}`;

  React.useEffect(() => {
    axios.get(URL).then((response) => {
      console.log(response.data);
      // setFinancials(response.data);

      const data = Object.entries(response.data)
        .filter(([key]) => relevantKeys.includes(key))
        .map(([key, value]) => ({
          key,
          value:
            typeof value === "object"
              ? JSON.stringify(value)
              : value.toString(),
        }));
      setTableData(data);
    });
  }, [stockSymbol]);

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

  const formatMarketCap = (value) => {
    const num = Number(value);
    if (num >= 1e12) {
      return `$${(num / 1e12).toFixed(2)} T`;
    } else if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)} B`;
    } else if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)} M`;
    } else {
      return `$${num.toLocaleString()}`;
    }
  };

  const formatValue = (key, value) => {
    switch (key) {
      case "marketCap":
        return formatMarketCap(value);
      case "regularMarketVolume":
        return Number(value).toLocaleString();
      case "regularMarketDayHigh":
      case "regularMarketDayLow":
        return `$${Number(value).toFixed(2)}`;
      case "trailingPE":
      case "forwardPE":
      case "priceToBook":
        return Number(value).toFixed(2);
      default:
        return value;
    }
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
      <LineChart symbol={stockSymbol}></LineChart>
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
              {tableData.map(({ key, value }) => (
                <TableRow
                  key={key}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {key}
                  </TableCell>
                  <TableCell align="right">{formatValue(key, value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {/* <div className="mt-12">
        <p>{financials["Description"]}</p>
      </div> */}
    </div>
  );
};

export default StockInfo;
