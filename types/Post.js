const { GraphQLObjectType } = require('graphql');
const { author } = require('./Author');
const postFields = require('./PostFields');

const postType = new GraphQLObjectType({
  name: 'RedditPost',
  description: 'A post made on a subreddit',
  fields: {
    author,
    ...postFields
  }
});

module.exports = {
  postType
};
