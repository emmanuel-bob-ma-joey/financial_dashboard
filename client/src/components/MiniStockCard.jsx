import React from "react";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import {
  BsGraphUp,
  BsFillArrowDownCircleFill,
  BsFillArrowUpCircleFill,
  BsArrowDownSquareFill,
  BsArrowUpSquareFill,
} from "react-icons/bs";

const MiniStockCard = ({ stockSymbol, companyName, exchange }) => {
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
    <NavLink to={`/stocks/${stockSymbol}`} key="stocks">
      <div
        key={stockSymbol}
        className="bg-white border-1 flex dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-3  rounded-2xl hover:drop-shadow-md"
      >
        <div className="p-4">
          {dailyPercentageChange < 0 ? (
            <BsArrowDownSquareFill
              className="text-red-400"
              style={{}}
              size="25px"
            />
          ) : (
            <BsArrowUpSquareFill
              className="text-green-400"
              style={{}}
              size="25px"
            />
          )}
        </div>
        <div>
          <p className="mt-3 ">
            <span className="text-lg font-semibold">
              {exchange
                ? post["regularMarketPrice"]
                : "$" + post["regularMarketPrice"]}
            </span>
            {changeColor == "green" ? (
              <span className={`text-green-600 text-sm  ml-2`}>
                +{dailyPercentageChange}%
              </span>
            ) : (
              <span className={`text-red-600 text-sm  ml-2`}>
                {dailyPercentageChange}%
              </span>
            )}
          </p>
          <p className="text-sm text-blue-400 mt-1">{post["longName"]}</p>
        </div>
      </div>
    </NavLink>
  );
};

export default MiniStockCard;
