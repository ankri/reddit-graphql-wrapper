const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./reddit-schema');
const { printSchema } = require('graphql');
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

app.listen(process.env.PORT || 9000, () => {
  console.log(`Listening on port ${process.env.PORT || 9000}`);
});
