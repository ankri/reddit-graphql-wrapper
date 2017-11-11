const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

const postFields = require('./PostFields');
const { loadUser } = require('../reddit-api');

const authorType = new GraphQLObjectType({
  name: 'Author',
  description: 'A reddit user',
  fields: {
    name: {
      description:
        'the account name of the poster. null if this is a promotional link',
      type: new GraphQLNonNull(GraphQLString),
      resolve: author => author
    },
    posts: {
      description: "The user's submissions",
      type: new GraphQLList(
        new GraphQLObjectType({
          name: 'UserSubmission',
          description: 'A post made by the user',
          fields: postFields
        })
      ),
      resolve: author =>
        loadUser(author)
          .then(listing => listing.data.children)
          .then(listing => listing.filter(data => data.kind === 't3'))
    }
  }
});

module.exports = {
  authorType
};
