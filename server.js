const express = require("express");
const graphqlHTTP = require("express-graphql");
require("dotenv").config();
const schema = require("./reddit-schema");

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

app.listen(process.env.PORT);
