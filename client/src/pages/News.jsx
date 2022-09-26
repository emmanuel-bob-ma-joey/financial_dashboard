import React from "react";
import axios from "axios";
import { NewsCard } from "../components";

const News = () => {
  const [articles, setArticles] = React.useState(null);

  React.useEffect(() => {
    async function getNews() {
      //this code personalizes news feed based on stocks in portfolio and watchlist, decided to comment out due to save on api calls.
      // const response = await fetch(`http://localhost:5000/portfolio/`);
      // const response2 = await fetch(`http://localhost:5000/watchlist/`);

      // if (!response.ok) {
      //   const message = `An error occurred: ${response.statusText}`;
      //   window.alert(message);
      //   return;
      // }

      // if (!response2.ok) {
      //   const message2 = `An error occurred: ${response2.statusText}`;
      //   window.alert(message2);
      //   return;
      // }

      // const portfolio = await response.json();
      // const watchlist = await response2.json();
      // console.log(portfolio);
      // console.log(watchlist);
      // let stockList = [
      //   ...new Set(
      //     portfolio.concat(watchlist).map((obj) => {
      //       return obj["StockSymbol"];
      //     })
      //   ),
      // ];

      // console.log(stockList);

      await axios
        .get(
          `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tipcs=finance&limit=50&apikey=Y0E17CDX4OXHO3V8`
        )
        .then((response) => {
          //console.log(response);
          setArticles(response.data.feed);
        });
    }

    getNews();
  }, []);

  if (!articles) {
    return null;
  }

  console.log(articles);

  return (
    <div className="flex flex-wrap">
      {articles.map((obj) => (
        <NewsCard
          key={obj.url}
          title={obj.title}
          url={obj.url}
          source={obj.source}
          image={obj.banner_image}
          summary={obj.summary}
          date={obj.time_published}
        />
      ))}
    </div>
  );
};

export default News;
