import React from "react";
import axios from "axios";
import { NewsCard } from "../components";

const News = () => {
  const [articles, setArticles] = React.useState(null);

  React.useEffect(() => {
    async function getNews() {
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
