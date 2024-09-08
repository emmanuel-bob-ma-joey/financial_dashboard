import React, { useState, useEffect } from "react";
import { PieChart, LineChart, StockCard, MiniStockCard } from "../components";
import { useStateContext } from "../contexts/ContextProvider";
import { Grid, Typography, Box, Container, Paper } from "@mui/material";
import axios from "axios";
import { auth } from "../firebase.js";
import { onAuthStateChanged } from "firebase/auth";

const Dashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [stockInfo, setStockInfo] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { activeMenu } = useStateContext();

  useEffect(() => {
    console.log("Setting up auth state listener");
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed, current user:", currentUser);
      setUser(currentUser);
    });

    return () => {
      console.log("Cleaning up auth state listener");
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    async function getStocks() {
      console.log("getStocks function called");
      setLoading(true);
      try {
        const uid = user ? user.uid : "NULL";
        const response = await fetch(
          `https://dashboard-backend-three-psi.vercel.app/api/portfolio?user=${uid}`
        );

        if (!response.ok) {
          throw new Error(`An error occurred: ${response.statusText}`);
        }

        const stocks = await response.json();
        console.log("this is stocks: ", stocks);

        const stockInfoPromises = stocks.map((stock) =>
          axios.get(
            `https://dashboard-backend-three-psi.vercel.app/api/finance/quote/${stock["StockSymbol"]}`
          )
        );

        const stockInfoResponses = await Promise.all(stockInfoPromises);
        const stockInfo = stockInfoResponses.map((response) => response.data);

        setStocks(stocks);
        setStockInfo(stockInfo);

        const stockSymbols = stocks.map((x) => x["StockSymbol"]);
        try {
          const recommendationsResponse = await axios.get(
            `https://dashboard-backend-three-psi.vercel.app/api/recommendations?stocks=${stockSymbols.join(
              ","
            )}`
          );
          setRecommendations(recommendationsResponse.data);
          console.log("recommendations: ", recommendationsResponse.data);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.error(
              "Recommendations API returned 404. Setting empty recommendations."
            );
            setRecommendations([]);
          } else {
            throw error;
          }
        }
      } catch (error) {
        console.error("Error fetching stocks:", error);
      } finally {
        setLoading(false);
      }
    }

    getStocks();
  }, [user]);

  const pieData = stocks.map((stock) => ({
    x: stock["StockSymbol"],
    y: parseFloat(stock["bookValue"]),
    text: `${stock["StockSymbol"]}`,
  }));

  const marketTotal = stocks.reduce(
    (total, stock, index) =>
      total + (stockInfo[index]?.regularMarketPrice || 0) * stock.shares,
    0
  );

  const bookTotal = stocks.reduce((total, stock) => total + stock.bookValue, 0);
  const change = (((marketTotal - bookTotal) / bookTotal) * 100).toFixed(1);

  console.log("Rendering Dashboard");

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h5">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        padding: 3,
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
        marginRight: 0,
        transition: "width 0.3s ease-in-out",
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h4" gutterBottom>
                Market Overview
              </Typography>
              <Grid container spacing={2}>
                {["^GSPC", "^IXIC", "^DJI", "^RUT"].map((symbol, index) => (
                  <Grid item xs={12} sm={6} md={3} key={symbol}>
                    <StockCard
                      stockSymbol={symbol}
                      companyName={
                        ["S&P500", "NASDAQ", "Dow Jones", "Russell 2000"][index]
                      }
                      exchange={true}
                    />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                Portfolio Performance
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Market Value</Typography>
                  <Typography variant="h4">
                    ${marketTotal.toFixed(2)}
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{
                        ml: 1,
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        color: "white",
                        bgcolor: change < 0 ? "error.main" : "success.main",
                      }}
                    >
                      {change}%
                    </Typography>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Book Value</Typography>
                  <Typography variant="h4">${bookTotal.toFixed(2)}</Typography>
                </Grid>
              </Grid>
              <Box sx={{ mt: 2, height: 500 }}>
                <PieChart data={pieData} />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, mb: 3, height: "100%" }}>
              <Typography variant="h5" gutterBottom>
                Daily Change
              </Typography>
              <Box sx={{ mt: 2, maxHeight: 400, overflowY: "auto" }}>
                {stocks.map((stock, index) => (
                  <Box key={stock.StockSymbol} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">
                      {stock.StockSymbol}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color:
                          stockInfo[index]?.regularMarketChangePercent >= 0
                            ? "success.main"
                            : "error.main",
                      }}
                    >
                      {stockInfo[index]?.regularMarketChangePercent.toFixed(2)}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                Portfolio Trend
              </Typography>
              <LineChart
                title="Portfolio Trend"
                stockSymbol="SPY"
                type="percentage"
              />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Recommended Stocks
              </Typography>
              {recommendations.length > 0 ? (
                <Box sx={{ display: "flex", overflowX: "auto", py: 2 }}>
                  {recommendations.map((stockSymbol) => (
                    <Box key={stockSymbol} sx={{ minWidth: 200, mr: 2 }}>
                      <MiniStockCard stockSymbol={stockSymbol} />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body1">
                  No recommendations available at the moment.
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
