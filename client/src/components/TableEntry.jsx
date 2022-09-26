import React from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

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
  TextField,
} from "@mui/material";
import { maxWidth } from "@mui/system";

const TableEntry = ({ row, handleDelete, update }) => {
  const navigate = useNavigate();
  const [hover, setHover] = React.useState(false);
  const [shares, setShares] = React.useState(row.shares);
  let tempShares = row.shares;

  const handleSubmit = async (event) => {
    let addShares = { shares: tempShares - row.shares, bookValue: row.Price };
    event.preventDefault();
    console.log("submitting new value of " + tempShares + " shares");
    await fetch(`http://localhost:5000/portfolio/${row.StockSymbol}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addShares),
    }).catch((error) => {
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
    //console.log("entered!");
  };

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
      <TableCell component="th" scope="row">
        {row.StockName}
      </TableCell>

      <TableCell align="right" component="th" scope="row">
        ${row.Price}
      </TableCell>
      {hover ? (
        <TableCell
          sx={{ width: "15%" }}
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
              id="shares"
              type="number"
              label="shares"
              size="small"
              sx={{ maxWidth: "90px" }}
              defaultValue={row.shares}
              onInput={(e) => (tempShares = e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </form>
        </TableCell>
      ) : (
        <TableCell
          sx={{ width: "15%" }}
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

      <TableCell align="right">
        <button
          component="th"
          // aria-label="edit"
          // text="Delete"
          className={` p-1 hover:drop-shadow-xl`}
          onClick={() => handleDelete(row)}
        >
          <TiTimes size={28} color="grey" />
        </button>
      </TableCell>

      {/* <TableCell align="right" component="th" scope="row">
        {row.shares}
      </TableCell> */}
    </TableRow>
  );
};

export default TableEntry;
