import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TiTimes } from "react-icons/ti";
import { auth } from "../firebase.js";
import { TableCell, TableRow, TextField, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
  transition: "background-color 0.3s ease",
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1),
  height: "40px", // Set a fixed height for all cells
}));

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    height: "30px", // Adjust this value to fit within the cell
    width: "70px", // Set a fixed width for the input
  },
  "& .MuiOutlinedInput-input": {
    padding: "5px 8px", // Adjust padding to center the text vertically
  },
});

const getBuySellZoneColor = (zone) => {
  switch (zone.toLowerCase()) {
    case "sell":
      return "linear-gradient(135deg, #4CAF50, #2E7D32)"; // Darker green gradient
    case "buy":
      return "linear-gradient(135deg, #F44336, #B71C1C)"; // Darker red gradient
    case "hold":
    default:
      return "linear-gradient(135deg, #9E9E9E, #424242)"; // Darker grey gradient
  }
};

const BuySellZoneCell = styled(StyledTableCell)(({ theme, zone }) => ({
  background: getBuySellZoneColor(zone),
  color: "white",
  fontWeight: "bold",
  borderRadius: "4px",
  textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
  transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
  "&:hover": {
    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
  },
}));

const TableEntry = ({ row, handleDelete, update }) => {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  const [shares, setShares] = useState(row.shares);
  const [user, setUser] = useState(auth.currentUser);
  const [sellPrice, setSellPrice] = useState(row.sellPrice);
  const [buyPrice, setBuyPrice] = useState(row.buyPrice);
  const [buyDays, setBuyDays] = useState(row.buyDays);
  const [sellDays, setSellDays] = useState(row.sellDays);
  const [consecutiveDays, setConsecutiveDays] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
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
  }, [buyPrice, sellPrice, row.StockSymbol, row.buySellZone]);

  const getZone = (price) => {
    if (price <= row.buyPrice) return "buy";
    if (price >= row.sellPrice) return "sell";
    return "hold";
  };

  const daysBetweenDates = (date1, date2) => {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((date1 - date2) / oneDay));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newData = {
      shares,
      bookValue: row.Price,
      StockSymbol: row.StockSymbol,
      buyPrice,
      sellPrice,
      buyDays,
      sellDays,
    };
    try {
      await fetch(
        `https://dashboard-backend-three-psi.vercel.app/api/portfolio/${user.uid}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newData),
        }
      );
      update(true);
    } catch (error) {
      window.alert(error);
    }
  };

  const handleMouseOver = () => setHover(true);
  const handleMouseLeave = () => setHover(false);
  const handleMouseEnter = () => navigate(`/stocks/${row.stockSymbol}`);

  if (loading) {
    return (
      <StyledTableRow>
        <StyledTableCell colSpan={12}>Loading...</StyledTableCell>
      </StyledTableRow>
    );
  }

  return (
    <StyledTableRow
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      key={row.StockSymbol}
    >
      <StyledTableCell>{row.StockSymbol}</StyledTableCell>
      <StyledTableCell align="right">${row.Price.toFixed(2)}</StyledTableCell>
      <StyledTableCell align="right">
        {hover ? (
          <form onSubmit={handleSubmit} onMouseLeave={handleSubmit}>
            <StyledTextField
              type="number"
              size="small"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              variant="outlined"
            />
          </form>
        ) : (
          shares
        )}
      </StyledTableCell>
      <StyledTableCell
        align="right"
        sx={{ color: row.PercentageChange > 0 ? "green" : "red" }}
      >
        {row.PercentageChange}%
      </StyledTableCell>
      <StyledTableCell
        align="right"
        sx={{ color: row.DollarChange > 0 ? "green" : "red" }}
      >
        ${Math.abs(row.DollarChange).toFixed(2)}
      </StyledTableCell>
      <StyledTableCell align="right">{row.dividendYield}%</StyledTableCell>
      <StyledTableCell align="right">
        {hover ? (
          <form onSubmit={handleSubmit} onMouseLeave={handleSubmit}>
            <StyledTextField
              type="number"
              size="small"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              variant="outlined"
            />
          </form>
        ) : (
          `$${buyPrice}`
        )}
      </StyledTableCell>
      <StyledTableCell align="right">
        {hover ? (
          <form onSubmit={handleSubmit} onMouseLeave={handleSubmit}>
            <StyledTextField
              type="number"
              size="small"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              variant="outlined"
            />
          </form>
        ) : (
          `$${sellPrice}`
        )}
      </StyledTableCell>
      <StyledTableCell align="right">
        {hover ? (
          <form onSubmit={handleSubmit} onMouseLeave={handleSubmit}>
            <StyledTextField
              type="number"
              size="small"
              value={buyDays}
              onChange={(e) => setBuyDays(e.target.value)}
              variant="outlined"
            />
          </form>
        ) : (
          buyDays
        )}
      </StyledTableCell>
      <StyledTableCell align="right">
        {hover ? (
          <form onSubmit={handleSubmit} onMouseLeave={handleSubmit}>
            <StyledTextField
              type="number"
              size="small"
              value={sellDays}
              onChange={(e) => setSellDays(e.target.value)}
              variant="outlined"
            />
          </form>
        ) : (
          sellDays
        )}
      </StyledTableCell>
      <BuySellZoneCell align="center" zone={row.buySellZone}>
        {row.buySellZonePercent.toFixed(2)}% {row.buySellZone}
      </BuySellZoneCell>
      <StyledTableCell align="right">
        {consecutiveDays === 365 ? `${consecutiveDays}+` : consecutiveDays}
      </StyledTableCell>
      <StyledTableCell align="right">
        <IconButton onClick={() => handleDelete(row)} size="small">
          <TiTimes />
        </IconButton>
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default TableEntry;
