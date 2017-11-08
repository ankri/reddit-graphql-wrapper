const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} = require("graphql");

const { loadSubreddit } = require("./reddit-api");
const subredditType = require("./types/Subreddit");

const redditSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "RedditAPI",
    description: "Reddit API",
    fields: {
      subreddit: {
        type: subredditType,
        args: {
          name: {
            type: new GraphQLNonNull(GraphQLString),
            description: "The name of the subreddit"
          }
        },
        resolve: (root, { name }) => {
          return loadSubreddit(name);
        }
      }
    }
  })
});

module.exports = redditSchema;
