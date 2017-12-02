const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList
} = require('graphql');

const { postType } = require('./Post');
const { loadSubredditListings } = require('../reddit-api');
const { timeIntervalType } = require('./TimeIntervalType');

const createPostListingsType = (
  description,
  listingType,
  hasTimeInterval = false
) => {
  const args = {
    after: {
      description: 'Load posts after this fullname id',
      type: GraphQLString
    },
    before: {
      description: 'Load posts before this fullname id',
      type: GraphQLString
    },
    limit: {
      description: 'Load this many posts',
      type: GraphQLInt
    },
    ...(hasTimeInterval && {
      timeInterval: {
        description:
          'Time interval for listings depending on a selected time interval',
        type: timeIntervalType
      }
    })
  };

  return {
    args,
    description,
    type: new GraphQLNonNull(new GraphQLList(postType)),
    resolve: (subreddit, args) =>
      loadSubredditListings(
        subreddit.data.display_name,
        listingType,
        args
      ).then(listing => listing.data.children)
  };
};

module.exports = createPostListingsType;
