import React from "react";
import axios from "axios";
import { NewsCard } from "../components";

const News = () => {
  const [articles, setArticles] = React.useState(null);

  React.useEffect(() => {
    async function getNews() {
      await axios
        .get(
          `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=technology&limit=50&apikey=${process.env.API_KEY}`
        )
        .then((response) => {
          //console.log(response);
          console.log("made news api call!");
          console.log(response);
          setArticles(response.data.feed);
        });
    }

    getNews();
  }, []);

  if (!articles) {
    console.log("no articles!");
    return null;
  } else {
    console.log("articles!");
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
