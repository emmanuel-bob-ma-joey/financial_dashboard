import React from "react";
import axios from "axios";

import { Header } from "../components";
import Autocomplete from "@mui/material/Autocomplete";
import { createFilterOptions } from "@mui/material/Autocomplete";

import TextField from "@mui/material/TextField";
import stockJson from "../data/nasdaq_screener_1662441305462.json";
import { StockInfo } from "../components";

const stockNames = stockJson.map(
  (element) => `${element["Name"]} - ${element["Symbol"]}`
);

const filterOptions = createFilterOptions({
  matchFrom: "any",
  limit: 10,
});

const StockList = () => {
  const [selectedStock, setSelectedStock] = React.useState(null);

  const showStock = (stock) => {
    console.log("this is" + stock);
    setSelectedStock(stock);
    console.log(" and this should be the same" + selectedStock);
  };
  console.log(selectedStock);

  return (
    <div>
      <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl">
        <div>
          <Header category="page" title="Search Stocks" />

          <Autocomplete
            filterOptions={filterOptions}
            type="button"
            id="autocomplete"
            options={stockNames}
            value={selectedStock}
            onChange={(event, newStock) => {
              setSelectedStock(newStock);
            }}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Search by company symbol or name" />
            )}
          />
        </div>
        <p>poop</p>
      </div>
      {selectedStock ? (
        <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl">
          <StockInfo
            companyName={selectedStock}
            stockSymbol={selectedStock.split(" ").pop()}
          />
        </div>
      ) : (
        <p>no stock</p>
      )}
    </div>
  );
};

export default StockList;
