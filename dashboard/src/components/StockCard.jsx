import React from "react";
import axios from "axios";
import { BsGraphUp } from "react-icons/bs";

const StockCard = ({ stockSymbol }) => {
  const baseURL = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockSymbol}&apikey=Y0E17CDX4OXHO3V8`;

  const [post, setPost] = React.useState(null);
  React.useEffect(() => {
    axios
      .get(`http://localhost:5000/finance/quote/${stockSymbol}`)
      .then((response) => {
        console.log(response);
        setPost(response.data);
      });
  }, []);

  if (!post) return null;
  console.log(post);

  const dailyPercentageChange = post["regularMarketChangePercent"].toFixed(2);
  let changeColor = "red";

  dailyPercentageChange > 0 ? (changeColor = "green") : (changeColor = "red");

  return (
    <div
      key={stockSymbol}
      className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl"
    >
      <button
        type="button"
        style={{ color: "#03C9D7", backgroundColor: "#E5FAFB" }}
        className="text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl"
      >
        {<BsGraphUp />}
      </button>
      <p className="mt-3 ">
        <span className="text-lg font-semibold">
          {post["regularMarketPrice"]}
        </span>
        {changeColor == "green" ? (
          <span className={`text-${changeColor}-600 text-sm  ml-2`}>
            +{dailyPercentageChange}%
          </span>
        ) : (
          <span className={`text-${changeColor}-600 text-sm  ml-2`}>
            -{dailyPercentageChange}%
          </span>
        )}

        {/* <span className={`text-${changeColor}-600 text-sm  ml-2`}>
          
            {dailyPercentageChange}%
          
          
        </span> */}
      </p>
      <p className="text-sm text-gray-400 mt-1">{stockSymbol} </p>
    </div>
  );
};

export default StockCard;
