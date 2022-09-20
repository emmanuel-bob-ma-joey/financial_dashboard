import React from "react";
import { BsCurrencyDollar } from "react-icons/bs";
import { GoPromitiveDot } from "react-icons/go";
import { PieChart, Button, LineChart, StockCard } from "../components";
import { useStateContext } from "../contexts/ContextProvider";
import { BsGraphUp } from "react-icons/bs";

//import data from data = later need to be api calls
const Dashboard = () => {
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
      <div className="flex m-3 flex-wrap lg:flex-nowrap justify-center gap-20 items-center">
        <StockCard stockSymbol="TSLA" />
        <StockCard stockSymbol="IBM" />
        <StockCard stockSymbol="AAPL" />
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
                  <span className="text-3xl font-semibold">$123,123</span>
                  <span className="p-1.5 hover:drop-shadow-xl cursor-pointer rounded-full text-white bg-green-400 ml-3 text-xs">
                    +23%
                  </span>
                </p>
                <p className="text-gray-500 mt-1">Market Value</p>
              </div>
              <div className="mt-8">
                <p>
                  <span className="text-3xl font-semibold">$123,123</span>
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
