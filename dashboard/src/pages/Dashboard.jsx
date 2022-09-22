import React from "react";
import { BsCurrencyDollar } from "react-icons/bs";
import { GoPromitiveDot } from "react-icons/go";
import { PieChart, Button, LineChart, StockCard } from "../components";
import { useStateContext } from "../contexts/ContextProvider";
import { BsGraphUp } from "react-icons/bs";
import { Card } from "@mui/material";
import axios from "axios";
import { ColumnSeries } from "@syncfusion/ej2-react-charts";

const Dashboard = () => {
  const [stocks, setStocks] = React.useState([]);
  const [stockInfo, setStockInfo] = React.useState([]);

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

      setStocks(stocks);
    }

    getStocks();
  }, []);

  console.log(stockInfo);
  console.log(stocks);
  let marketTotal = 0;
  for (let i = 0; i < stocks.length; i++) {
    marketTotal += stockInfo[i]["regularMarketPrice"] * stocks[i]["shares"];
  }

  let bookTotal = stocks
    .reduce((partialsum, x) => partialsum + x["bookValue"], 0)
    .toFixed(2);
  let change = (((marketTotal - bookTotal) / bookTotal) * 100).toFixed(1);

  return (
    <div className="mt-12 ">
      <div className="flex  flex-wrap   lg:flex-nowrap justify-center ">
        <div className="bg-white  dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-white">earnings</p>
              <p className="text-2xl">$123.43</p>
            </div>
          </div>
          <div className="mt-6">
            <Button
              color="white"
              bgColor="blue"
              text="download"
              borderRadius="10px"
              size="md"
            ></Button>
          </div>
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
          <div className="flex justify-between">
            <p className="font-semibold text-xl">Portfolio Performance</p>
            <div className="flex items-center gap-4">
              <p>can put something here</p>
            </div>
          </div>
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
              <div className="mt-8">
                <p>
                  <span className="text-3xl font-semibold">${bookTotal}</span>
                </p>
                <p className="text-gray-500 mt-1">Book Value</p>
              </div>
            </div>
          </div>
          <div>
            <LineChart
              title="Portfolio Overview"
              stockSymbol="SPY"
              type="percentage"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
