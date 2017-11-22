const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

const { loadSubreddit } = require('./reddit-api');
const subredditType = require('./types/Subreddit');

const redditSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RedditAPI',
    description: 'Call the Reddit API via GraphQL',
    fields: {
      subreddit: {
        type: subredditType,
        args: {
          name: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The name of the subreddit'
          }
        },
        resolve: (root, { name }) => {
          const subredditName = name.replace(/\W/, '');
          return loadSubreddit(subredditName);
        }
      }
    }
  })
});

module.exports = redditSchema;
