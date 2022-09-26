import React from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from "@mui/material";
const NewsCard = ({ title, url, source, image, summary, date }) => {
  let realDate = `${date.slice(0, 4)}/${date.slice(4, 6)}/${date.slice(
    6,
    8
  )} at ${parseInt(date.slice(9, 11))}:${date.slice(11, 13)} UTC`;

  return (
    <Card className=" max-w-sm min-w-min h-auto bg-white border-1 dark:text-gray-200 dark:bg-secondary-dark-bg  m-5  p-4 pt-5 rounded-2xl hover:drop-shadow-md">
      <Typography gutterBottom variant="h5" component="div">
        {title}
      </Typography>
      <CardMedia component="img" height="140" image={image} />
      <CardContent>
        <Typography gutterBottom variant="caption" component="div">
          {realDate}
        </Typography>
        <Typography variant="body2" color="text.secondary" component="div">
          {summary}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="outlined"
          target="_blank"
          href={url}
          sx={{ color: "blue" }}
          size="small"
        >
          Open Article
        </Button>
      </CardActions>
    </Card>
  );
};

export default NewsCard;
