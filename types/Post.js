const { GraphQLObjectType } = require('graphql');

const { authorType } = require('./Author');
const postFields = require('./PostFields');

const postType = new GraphQLObjectType({
  name: 'RedditPost',
  description: 'A post made on a subreddit',
  fields: {
    author: {
      type: authorType,
      name: 'Author',
      resolve: post => post.data.author
    },
    ...postFields
  }
});

module.exports = {
  postType
};
