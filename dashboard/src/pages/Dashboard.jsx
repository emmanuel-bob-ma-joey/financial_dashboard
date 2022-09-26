import React from "react";
import { Carousel } from "@trendyol-js/react-carousel";
import { BsCurrencyDollar } from "react-icons/bs";
import { GoPromitiveDot } from "react-icons/go";
import {
  PieChart,
  Button,
  LineChart,
  StockCard,
  MiniStockCard,
} from "../components";
import { useStateContext } from "../contexts/ContextProvider";
import { BsGraphUp } from "react-icons/bs";
import { Card } from "@mui/material";
import axios from "axios";

const Dashboard = () => {
  const [stocks, setStocks] = React.useState([]);
  const [stockInfo, setStockInfo] = React.useState([]);
  const [trendingStocks, setTrendingStocks] = React.useState([]);
  const [recommendations, setRecommendations] = React.useState([]);

  React.useEffect(() => {
    async function getStocks() {
      const response = await fetch(`http://localhost:5000/portfolio/`);

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const stocks = await response.json();
      console.log(stocks);
      for (let i = 0; i < stocks.length; i++) {
        console.log("making api call...");
        console.log(stocks[i]["StockSymbol"]);

        await axios
          .get(
            `http://localhost:5000/finance/quote/${stocks[i]["StockSymbol"]}`
          )
          .then((response) => {
            console.log(response);
            setStockInfo((oldArray) => [...oldArray, response.data]);
          });
      }

      let stockSymbols = stocks.map((x) => x["StockSymbol"]);
      console.log(stockSymbols);

      setStocks(stocks);

      await axios
        .get(`http://localhost:5000/finance/trending`)
        .then((response) => {
          console.log(response);
          setTrendingStocks(response);
        });
      await axios
        .get(`http://localhost:5000/finance/recommended`, {
          params: { stockSymbols: stockSymbols },
        })
        .then((response) => {
          console.log(response.data);
          let info = [].concat(
            ...response.data.map((x) =>
              x["recommendedSymbols"].map((y) => y["symbol"])
            )
          );

          info = [...new Set(info)];
          info = info.reduce(function (result, element) {
            if (!stockSymbols.includes(element)) {
              result.push(element);
            }
            return result;
          }, []);
          console.log(info);
          setRecommendations(info);
        });
    }

    getStocks();
  }, []);

  console.log(stockInfo);
  console.log(stocks);
  console.log(recommendations);
  let pieData = [];
  for (let i = 0; i < stocks.length; i++) {
    pieData.push({
      x: stocks[i]["StockSymbol"],
      y: stocks[i]["bookValue"].toFixed(2),
      text: `${stocks[i]["StockSymbol"]}`,
    });
  }

  let marketTotal = 0;
  for (let i = 0; i < stocks.length; i++) {
    marketTotal += stockInfo[i]["regularMarketPrice"] * stocks[i]["shares"];
  }

  let bookTotal = stocks
    .reduce((partialsum, x) => partialsum + x["bookValue"], 0)
    .toFixed(2);
  let change = (((marketTotal - bookTotal) / bookTotal) * 100).toFixed(1);

  return (
    <div className="mt-12  ">
      <div className="flex flex-col justify-center ">
        <h1 className="self-center">
          Based on your portfolio you may be interested in
        </h1>
        <div className="bg-white self-center flex overflow-x-scroll  dark:text-gray-200 dark:bg-secondary-dark-bg h-36 rounded-xl md:w-780  p-8 pt-9 m-3  bg-no-repeat bg-cover bg-center">
          {recommendations.map((stockSymbol) => (
            <MiniStockCard className="flex-row" stockSymbol={stockSymbol} />
          ))}
        </div>
      </div>

      <div className="flex m-3 flex-wrap lg:flex-nowrap justify-center gap-1 items-center">
        <StockCard stockSymbol="^GSPC" companyName="S&P500" exchange={true} />

        <StockCard stockSymbol="^IXIC" companyName="NASDAQ" exchange={true} />
        <StockCard stockSymbol="^DJI" companyName="Dow Jones" exchange={true} />
        <StockCard
          stockSymbol="^RUT"
          companyName="Russell 2000"
          exchange={true}
        />
      </div>

      <div className="flex gap-10 flex-wrap justify-center">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 p-4 rounded-2xl md:w-780">
          <p className="font-semibold text-xl">Portfolio Performance</p>

          <div className="mt-10 flex gap-10 flex-wrap justify-center">
            <div className="border-r-1 border-color m-4 pr-10">
              <div>
                <p>
                  <span className="text-3xl font-semibold">
                    ${marketTotal.toFixed(2)}
                  </span>
                  {change < 0 ? (
                    <span className="p-1.5 hover:drop-shadow-xl cursor-pointer rounded-full text-white bg-red-400 ml-3 text-xs">
                      {change}%
                    </span>
                  ) : (
                    <span className="p-1.5 hover:drop-shadow-xl cursor-pointer rounded-full text-white bg-green-400 ml-3 text-xs">
                      +{change}%
                    </span>
                  )}
                </p>
                <p className="text-gray-500 mt-1">Market Value</p>
              </div>
            </div>
            <div className="m-4 pr-10">
              <p>
                <span className="text-3xl font-semibold">${bookTotal}</span>
              </p>
              <p className="text-gray-500 mt-1">Book Value</p>
            </div>
          </div>
          <PieChart data={pieData} />
          <div>
            {/* <LineChart
              title="Portfolio Overview"
              stockSymbol="SPY"
              type="percentage"
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
