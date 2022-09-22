import React from "react";
import axios from "axios";
import {
  BsGraphUp,
  BsFillArrowDownCircleFill,
  BsFillArrowUpCircleFill,
} from "react-icons/bs";

const StockCard = ({ stockSymbol, companyName, exchange }) => {
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
    <button
      onClick={() => {
        console.log("clicked on " + stockSymbol);
      }}
    >
      <div
        key={stockSymbol}
        className="bg-white border-1 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-5 rounded-2xl hover:drop-shadow-md"
      >
        {/* <div
          style={{ color: "#03C9D7", backgroundColor: "#E5FAFB" }}
          className="text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl"
        >
          
        </div> */}

        {dailyPercentageChange < 0 ? (
          <BsFillArrowDownCircleFill
            className="text-red-400"
            style={{}}
            size="50px"
          />
        ) : (
          <BsFillArrowUpCircleFill
            className="text-green-400"
            style={{}}
            size="50px"
          />
        )}

        <p className="mt-3 ">
          <span className="text-lg font-semibold">
            {exchange
              ? post["regularMarketPrice"]
              : "$" + post["regularMarketPrice"]}
          </span>
          {/* encountered strange tailwind bug, doing this to colour numbers for now */}
          {changeColor == "green" ? (
            <span className={`text-green-600 text-sm  ml-2`}>
              +{dailyPercentageChange}%
            </span>
          ) : (
            <span className={`text-red-600 text-sm  ml-2`}>
              {dailyPercentageChange}%
            </span>
          )}

          {/* <span className={`text-${changeColor}-600 text-sm  ml-2`}>
          
            {dailyPercentageChange}%
          
          
        </span> */}
        </p>
        <p className="text-sm text-blue-400 mt-1">
          {companyName ? companyName : stockSymbol}{" "}
        </p>
      </div>
    </button>
  );
};

export default StockCard;
