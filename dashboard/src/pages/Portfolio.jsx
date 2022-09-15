import React from "react";
import axios from "axios";

import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Resize,
  Sort,
  ContextMenu,
  Filter,
  Page,
  ExcelExport,
  PdfExport,
  Edit,
  Inject,
} from "@syncfusion/ej2-react-grids";
import { Header } from "../components";

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
  const [daily, setDaily] = React.useState([]);
  const [intraDay, setIntraday] = React.useState([]);
  const [stocks, setStocks] = React.useState([]);

  let stockData = [];
  React.useEffect(() => {
    async function getStocks() {
      const response = await fetch(`http://localhost:5000/portfolio/`);

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const stocks = await response.json();
      for (let i = 0; i < stocks.length; i++) {
        const [firstResponse, secondResponse] = await Promise.all([
          axios.get(
            `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stocks[i]["StockSymbol"]}&apikey=Y0E17CDX4OXHO3V8`
          ),
          axios.get(
            `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stocks[i]["StockSymbol"]}&interval=5min&apikey=Y0E17CDX4OXHO3V8`
          ),
        ]);

        // Update state once with responses

        setDaily((oldArray) => [...oldArray, firstResponse.data]);
        setIntraday((oldArray) => [...oldArray, secondResponse.data]);
      }

      setStocks(stocks);
    }

    getStocks();
  }, []);
  if (!daily || !intraDay || !stocks) return null;
  if (daily["Note"] || intraDay["Note"])
    return (
      <p>Unable to load due to API limit, please try again in a few seconds.</p>
    );

  let fail = false;

  daily.map((element) =>
    Object.keys(element).forEach(function (key, index) {
      if (key == "Note") {
        fail = true;
      }
    })
  );

  intraDay.map((element) =>
    Object.keys(element).forEach(function (key, index) {
      if (key == "Note") {
        fail = true;
      }
    })
  );

  if (fail) {
    return (
      <p>Unable to load due to API limit, please try again in a few seconds.</p>
    );
  }

  for (let i = 0; i < stocks.length; i++) {
    let temp = {};
    temp.StockName = stocks[i]["companyName"];
    temp.StockSymbol = stocks[i]["StockSymbol"];
    temp.Price = Object.entries(intraDay[i]["Time Series (5min)"])[0][1][
      "4. close"
    ];
    temp.PercentageChange = (
      ((Object.entries(intraDay[i]["Time Series (5min)"])[0][1]["4. close"] -
        Object.entries(daily[i]["Time Series (Daily)"])[0][1]["1. open"]) /
        Object.entries(daily[i]["Time Series (Daily)"])[0][1]["1. open"]) *
      100
    ).toFixed(2);
    temp.DollarChange = (
      Object.entries(intraDay[i]["Time Series (5min)"])[0][1]["4. close"] -
      Object.entries(daily[i]["Time Series (Daily)"])[0][1]["1. open"]
    ).toFixed(2);

    stockData.push(temp);
  }

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl">
      <div>
        <Header category="page" title="My Portfolio" />
      </div>

      <GridComponent id="gridComp" dataSource={stockData}>
        <ColumnsDirective>
          {ordersGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
      </GridComponent>
    </div>
  );
};

export default Portfolio;
