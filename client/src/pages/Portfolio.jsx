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

const ordersGrid = [
  {
    field: "StockSymbol",
    headerText: "StockSymbol",
    textAlign: "Center",
    width: "120",
  },
  {
    field: "StockName",
    headerText: "Stock Name",
    width: "150",
    textAlign: "Center",
  },
  {
    field: "Price",
    headerText: "Price",
    width: "150",
    textAlign: "Center",
  },
  {
    field: "DollarChange",
    headerText: "Dollar Change",
    format: "C2",
    textAlign: "Center",
    editType: "numericedit",
    width: "150",
  },
  {
    headerText: "Percentage Change",
    field: "PercentageChange",
    textAlign: "Center",
    width: "120",
  },
];

const Portfolio = () => {
  const [update, setUpdate] = React.useState(false);

  const [stocks, setStocks] = React.useState([]);
  const [stockInfo, setStockInfo] = React.useState([]);
  const [user, setUser] = React.useState(auth.currentUser);

  let stockData = [];

  // onAuthStateChanged(auth, (u) => {
  //   if (u) {
  //     // User is signed in, see docs for a list of available properties
  //     // https://firebase.google.com/docs/reference/js/auth.user
  //     setUser(u);
  //     // ...
  //   } else {
  //     // User is signed out
  //     setUser(null);
  //   }
  // });

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
  }, [update, user]);
  if (!stocks) return null;

  let fail = false;

  if (fail) {
    return (
      <p>Unable to load due to API limit, please try again in a few seconds.</p>
    );
  }

  for (let i = 0; i < stocks.length; i++) {
    let temp = {};
    temp.StockName = stocks[i]["companyName"];
    temp.StockSymbol = stocks[i]["StockSymbol"];
    temp.shares = stocks[i]["shares"];
    temp.Price = stockInfo[i]["regularMarketPrice"];
    temp.PercentageChange =
      stockInfo[i]["regularMarketChangePercent"].toFixed(2);
    temp.DollarChange = stockInfo[i]["regularMarketChange"].toFixed(2);

    stockData.push(temp);
  }

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
              <TableCell>Company Name</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Shares</TableCell>
              <TableCell align="right">% change</TableCell>
              <TableCell align="right">dollar change</TableCell>
              <TableCell align="right">Delete</TableCell>
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

              // <TableRow
              //   className="hover:bg-light-gray"
              //   key={row.StockSymbol}
              //   sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              // >
              //   <TableCell component="th" scope="row">
              //     {row.StockSymbol}
              //   </TableCell>
              //   <TableCell component="th" scope="row">
              //     {row.StockName}
              //   </TableCell>

              //   <TableCell align="right" component="th" scope="row">
              //     {row.Price}
              //   </TableCell>
              //   <TableCell align="right" component="th" scope="row">
              //     {row.PercentageChange}
              //   </TableCell>
              //   <TableCell align="right">{row.DollarChange}</TableCell>
              //   <TableCell align="right">
              //     <button
              //       component="th"
              //       // aria-label="edit"
              //       // text="Delete"
              //       className={` p-1 hover:drop-shadow-xl`}
              //       onClick={() => handleDelete(row)}
              //     >
              //       <TiTimes size={28} />
              //     </button>
              //   </TableCell>
              //   <TableCell align="right" component="th" scope="row">
              //     {row.shares}
              //   </TableCell>
              // </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Portfolio;
