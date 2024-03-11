import React from "react";
import axios from "axios";
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  LineSeries,
  DateTime,
  Legend,
  Tooltip,
} from "@syncfusion/ej2-react-charts";
import { useStateContext } from "../../contexts/ContextProvider";
import { Header } from "../../components";

let personal = [
  { x: "2022-08-27", y: 0 },
  { x: "2022-08-28", y: 2 },
  { x: "2022-08-29", y: 3 },
  { x: "2022-08-30", y: 2 },
  { x: "2022-08-31", y: 1 },
  { x: "2022-09-01", y: 3 },
  { x: "2022-09-02", y: 6 },
];

//args: stockSymbol = company stock symbol
//    string type= percentage or value - denotes y axis scale type
// string compareTo = portfolio or watchlist
//
const LineChart = ({ title, stockSymbol, type }) => {
  const baseURL = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${stockSymbol}&apikey=Y0E17CDX4OXHO3V8`;
  const [post, setPost] = React.useState(null);
  React.useEffect(() => {
    axios.get(baseURL).then((response) => {
      setPost(response.data);
    });
  }, []);
  console.log(post);
  if (!post) return null;
  if (post["Note"] || post["Information"]) {
    return (
      <p>Unable to load due to API limit, please try again in a few seconds.</p>
    );
  }

  console.log(post);
  console.log(post["Time Series (Daily)"]);
  let poop = Object.entries(post["Time Series (Daily)"]);
  let StockData = [];
  let previousDay = 0;

  if (type == "percentage") {
    console.log(stockSymbol + "is by percentage");
    for (let i = 0; i < Object.keys(poop).length; i++) {
      let datapoint = {};
      datapoint["x"] = poop[i][0];
      datapoint["y"] =
        ((poop[i][1]["1. open"] - poop[i][1]["4. close"]) /
          poop[i][1]["1. open"]) *
          100 +
        previousDay;
      StockData.push(datapoint);
      previousDay = datapoint["y"];
    }
  } else if (type == "value") {
    console.log(stockSymbol + "is by value");
    for (let i = 0; i < Object.keys(poop).length; i++) {
      let datapoint = {};
      datapoint["x"] = poop[i][0];
      datapoint["y"] = poop[i][1]["1. open"];
      StockData.push(datapoint);
      previousDay = datapoint["y"];
    }
  }

  console.log(StockData);

  return (
    <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
      <Header title={title} />
      <div className="w-full">
        {type == "percentage" ? (
          <ChartComponent
            primaryXAxis={{
              valueType: "DateTime",
              //labelFormat: "y",
              //intervalType: "Weeks",

              edgeLabelPlacement: "Shift",
              majorGridLines: { width: 0 },
              background: "white",
            }}
            primaryYAxis={{
              labelFormat: "{value}%",
              rangePadding: "None",
              minimum: -50,
              maximum: 50,
              interval: 10,
              lineStyle: { width: 0 },
              majorTickLines: { width: 0 },
              minorTickLines: { width: 0 },
            }}
          >
            <Inject services={[LineSeries, DateTime, Legend]} />
            <SeriesCollectionDirective>
              <SeriesDirective
                dataSource={StockData}
                xName="x"
                yName="y"
                name={stockSymbol}
                width={2}
                type="Line"
              ></SeriesDirective>
              {/* <SeriesDirective
                dataSource={personal}
                xName="x"
                yName="y"
                name="Your portfolio"
                width={2}
                type="Line"
              ></SeriesDirective> */}
            </SeriesCollectionDirective>
          </ChartComponent>
        ) : (
          <ChartComponent
            primaryXAxis={{
              valueType: "DateTime",
              // labelFormat: "y",
              // intervalType: "Days",
              edgeLabelPlacement: "Shift",
              majorGridLines: { width: 0 },
              background: "white",
            }}
            primaryYAxis={{
              labelFormat: "{value}$",
              rangePadding: "None",

              lineStyle: { width: 0 },
              majorTickLines: { width: 0 },
              minorTickLines: { width: 0 },
            }}
          >
            <Inject services={[LineSeries, DateTime, Legend]} />
            <SeriesCollectionDirective>
              <SeriesDirective
                dataSource={StockData}
                xName="x"
                yName="y"
                name={stockSymbol}
                width={2}
                type="Line"
              ></SeriesDirective>
              {/* <SeriesDirective
                dataSource={personal}
                xName="x"
                yName="y"
                name="Your portfolio"
                width={2}
                type="Line"
              ></SeriesDirective> */}
            </SeriesCollectionDirective>
          </ChartComponent>
        )}
      </div>
    </div>
  );
};

export default LineChart;
