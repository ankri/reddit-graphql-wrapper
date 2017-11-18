const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./reddit-schema');
const { printSchema } = require('graphql');
const { loadRandomSubreddit } = require('./reddit-api');
require('dotenv').config();

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

app.get('/schema', (request, response) => {
  response.send(printSchema(schema));
});

app.get('/random', async (request, response) => {
  const randomSubreddit = await loadRandomSubreddit();
  response.json({ name: randomSubreddit });
});

app.get('/randnsfw', async (request, response) => {
  const randomSubreddit = await loadRandomSubreddit(true);
  response.json({ name: randomSubreddit });
});

app.listen(process.env.PORT || 9000, () => {
  console.log(`Listening on port ${process.env.PORT || 9000}`);
});
