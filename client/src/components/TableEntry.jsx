import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TiTimes } from "react-icons/ti";
import { auth } from "../firebase.js";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  TextField,
} from "@mui/material";

const TableEntry = ({ row, handleDelete, update }) => {
  const navigate = useNavigate();
  const [hover, setHover] = React.useState(false);
  const [shares, setShares] = React.useState(row.shares);
  const [user, setUser] = React.useState(auth.currentUser);
  const [sellPrice, setSellPrice] = React.useState(row.sellPrice);
  const [buyPrice, setBuyPrice] = React.useState(row.buyPrice);
  const [buyDays, setBuyDays] = React.useState(row.buyDays);
  const [sellDays, setSellDays] = React.useState(row.sellDays);
  const [consecutiveDays, setConsecutiveDays] = useState(0);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    // This listener is called whenever the user's sign-in state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser); // Update your state with the new user
      console.log("user auth status has changed");
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const response = await axios.get(
          `https://dashboard-backend-three-psi.vercel.app/api/finance/historical/${row.StockSymbol}`
        );
        const historicalData = response.data;

        // Calculate consecutive days in current zone
        let days = 0;
        const currentZone = row.buySellZone.toLowerCase();
        const currentDate = new Date();

        for (let i = historicalData.length - 1; i >= 0; i--) {
          const price = historicalData[i].close;
          const zone = getZone(price);

          if (zone !== currentZone) {
            const historicalDate = new Date(historicalData[i].date);
            days = daysBetweenDates(currentDate, historicalDate);
            break;
          }
        }
        days = days === 0 ? 365 : days;

        setConsecutiveDays(days);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching historical data:", error);
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [buyPrice, sellPrice]);

  const getBuySellZoneColor = (zone) => {
    switch (zone.toLowerCase()) {
      case "sell":
        return "#4CAF50"; // Green
      case "buy":
        return "#F44336"; // Red
      case "hold":
      default:
        return "#9E9E9E"; // Grey
    }
  };

  const getZone = (price) => {
    if (price <= row.buyPrice) return "buy";
    if (price >= row.sellPrice) return "sell";
    return "hold";
  };

  const daysBetweenDates = (date1String, date2String) => {
    // Parse the dates
    const date1 = new Date(date1String);
    const date2 = new Date(date2String);

    // Ensure both dates are valid
    if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
      throw new Error("Invalid date format");
    }

    // Set both dates to noon UTC to avoid daylight saving time issues
    date1.setUTCHours(12, 0, 0, 0);
    date2.setUTCHours(12, 0, 0, 0);

    // Calculate the difference in milliseconds
    const differenceMs = Math.abs(date2.getTime() - date1.getTime());

    // Convert the difference to days
    return Math.floor(differenceMs / (1000 * 60 * 60 * 24));
  };

  const handleSubmit = async (event) => {
    let newData = {
      shares,
      bookValue: row.Price,
      StockSymbol: row.StockSymbol,
      buyPrice,
      sellPrice,
      buyDays,
      sellDays,
    };
    event.preventDefault();
    await fetch(
      `https://dashboard-backend-three-psi.vercel.app/api/portfolio/${user.uid}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      }
    ).catch((error) => {
      window.alert(error);
      return;
    });
    update(true);
  };

  const handleMouseOver = () => {
    setHover(true);
  };

  const handleMouseLeave = () => {
    setHover(false);
  };

  const handleMouseEnter = () => {
    navigate(`/stocks/${row.stockSymbol}`);
  };

  if (loading) {
    return (
      <TableRow>
        <TableCell colSpan={12}>Loading...</TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow
      className="hover:bg-light-gray w-full"
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      key={row.StockSymbol}
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
        height: "80px",
      }}
    >
      <TableCell component="th" scope="row">
        {row.StockSymbol}
      </TableCell>
      {/* <TableCell component="th" scope="row">
        {row.StockName}
      </TableCell> */}

      <TableCell align="right" component="th" scope="row">
        ${row.Price}
      </TableCell>
      {hover ? (
        <TableCell
          sx={{ width: "10%" }}
          align="right"
          component="th"
          scope="row"
        >
          <form
            onSubmit={handleSubmit}
            onMouseLeave={handleSubmit}
            // onMouseEnter={handleMouseEnter}
          >
            <TextField
              id="shares"
              type="number"
              label="shares"
              size="small"
              sx={{ maxWidth: "90px" }}
              defaultValue={row.shares}
              onInput={(e) => setShares(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </form>
        </TableCell>
      ) : (
        <TableCell
          sx={{ width: "10%" }}
          align="right"
          component="th"
          scope="row"
        >
          {row.shares}
        </TableCell>
      )}
      {row.PercentageChange > 0 ? (
        <TableCell
          sx={{ color: "green" }}
          align="right"
          component="th"
          scope="row"
        >
          {row.PercentageChange}%
        </TableCell>
      ) : (
        <TableCell
          sx={{ color: "red" }}
          align="right"
          component="th"
          scope="row"
        >
          {row.PercentageChange}%
        </TableCell>
      )}
      {row.DollarChange > 0 ? (
        <TableCell sx={{ color: "green" }} align="right">
          ${row.DollarChange}
        </TableCell>
      ) : (
        <TableCell sx={{ color: "red" }} align="right">
          -${row.DollarChange * -1}
        </TableCell>
      )}
      <TableCell align="right" component="th" scope="row">
        {row.dividendYield}%
      </TableCell>
      {hover ? (
        <TableCell
          sx={{ width: "10%" }}
          align="right"
          component="th"
          scope="row"
        >
          <form onSubmit={handleSubmit} onMouseLeave={handleSubmit}>
            <TextField
              id="buyPrice"
              type="number"
              label="buyPrice"
              size="small"
              sx={{ maxWidth: "90px" }}
              defaultValue={row.buyPrice}
              onInput={(e) => setBuyPrice(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </form>
        </TableCell>
      ) : (
        <TableCell
          sx={{ width: "10%" }}
          align="right"
          component="th"
          scope="row"
        >
          ${row.buyPrice}
        </TableCell>
      )}
      {hover ? (
        <TableCell
          sx={{ width: "10%" }}
          align="right"
          component="th"
          scope="row"
        >
          <form
            // onSubmit={handleSubmit}
            // onChange={handleSubmit}
            onSubmit={handleSubmit}
            onMouseLeave={handleSubmit}
          >
            <TextField
              id="sellPrice"
              type="number"
              label="sellPrice"
              size="small"
              sx={{ maxWidth: "90px" }}
              defaultValue={row.sellPrice}
              onInput={(e) => setSellPrice(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </form>
        </TableCell>
      ) : (
        <TableCell
          sx={{ width: "10%" }}
          align="right"
          component="th"
          scope="row"
        >
          ${row.sellPrice}
        </TableCell>
      )}
      {hover ? (
        <TableCell
          sx={{ width: "10%" }}
          align="right"
          component="th"
          scope="row"
        >
          <form
            // onSubmit={handleSubmit}
            // onChange={handleSubmit}
            onSubmit={handleSubmit}
            onMouseLeave={handleSubmit}
          >
            <TextField
              id="buyDays"
              type="number"
              label="buyDays"
              size="small"
              sx={{ maxWidth: "90px" }}
              defaultValue={row.buyDays}
              onInput={(e) => setBuyDays(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </form>
        </TableCell>
      ) : (
        <TableCell
          sx={{ width: "10%" }}
          align="right"
          component="th"
          scope="row"
        >
          {row.buyDays}
        </TableCell>
      )}
      {hover ? (
        <TableCell
          sx={{ width: "10%" }}
          align="right"
          component="th"
          scope="row"
        >
          <form
            // onSubmit={handleSubmit}
            // onChange={handleSubmit}
            onSubmit={handleSubmit}
            onMouseLeave={handleSubmit}
          >
            <TextField
              id="buyPrice"
              type="number"
              label="sellDays"
              size="small"
              sx={{ maxWidth: "90px" }}
              defaultValue={row.sellDays}
              onInput={(e) => setSellDays(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </form>
        </TableCell>
      ) : (
        <TableCell
          sx={{ width: "10%" }}
          align="right"
          component="th"
          scope="row"
        >
          {row.sellDays}
        </TableCell>
      )}
      <TableCell
        align="center"
        style={{
          backgroundColor: getBuySellZoneColor(row.buySellZone),
          color: "white",
          fontWeight: "bold",
        }}
      >
        {row.buySellZonePercent.toFixed(2)}% {row.buySellZone}
      </TableCell>
      {consecutiveDays === 365 ? (
        <TableCell align="right" component="th" scope="row">
          {consecutiveDays} +
        </TableCell>
      ) : (
        <TableCell align="right" component="th" scope="row">
          {consecutiveDays}
        </TableCell>
      )}
      <TableCell align="right">
        <button
          component="th"
          className={` p-1 hover:drop-shadow-xl`}
          onClick={() => handleDelete(row)}
        >
          <TiTimes size={28} color="grey" />
        </button>
      </TableCell>
    </TableRow>
  );
};

export default TableEntry;
