import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [selectedStock, setSelectedStock] = React.useState(null);
  const { stockSymbol } = useParams();

  React.useEffect(() => {
    if (stockSymbol != "search") {
      setSelectedStock(stockSymbol);
    }
  }, []);

  console.log(stockSymbol);

  const showStock = (stock) => {
    console.log("this is" + stock);
    setSelectedStock(stock);
    console.log(" and this should be the same" + selectedStock);
  };

  const searchStock = (event, newStock) => {
    setSelectedStock(newStock);
    console.log("poop" + newStock);
    navigate(`/stocks/${newStock}`);
  };
  console.log(selectedStock);

  return (
    <div>
      <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl">
        <div>
          <Header category="page" title="Search Stocks" />

          <Autocomplete
            filterOptions={filterOptions}
            freeSolo={true}
            type="button"
            id="autocomplete"
            options={stockNames}
            value={selectedStock}
            onChange={searchStock}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Search by company symbol or name" />
            )}
          />
        </div>
      </div>
      {selectedStock ? (
        <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl">
          <StockInfo
            companyName={`${selectedStock} ${selectedStock}`}
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
