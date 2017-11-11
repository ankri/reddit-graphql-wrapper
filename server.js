const express = require('express');
const graphqlHTTP = require('express-graphql');
require('dotenv').config();
const schema = require('./reddit-schema');

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

app.listen(process.env.PORT || 9000, () => {
  console.log(`Listening on port ${process.env.PORT || 9000}`);
});
