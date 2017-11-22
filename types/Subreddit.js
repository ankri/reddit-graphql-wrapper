const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean
} = require('graphql');

const createSubredditListings = require('./PostListing');
const createSubredditMedia = require('./MediaListing');
const subredditFields = require('./SubredditFields');

const subredditType = new GraphQLObjectType({
  name: 'Subreddit',
  description: 'Information about the subreddit',
  fields: {
    ...subredditFields,
    listings: {
      type: new GraphQLObjectType({
        name: 'SubredditListings',
        description: 'The listings for this subreddit',
        fields: {
          // TODO add time argument
          hot: createSubredditListings('Hot listings of the subreddit', 'hot'),
          top: createSubredditListings('Top listings of the subreddit', 'top'),
          new: createSubredditListings('New listings of the subreddit', 'new'),
          rising: createSubredditListings(
            'Rising listings of the subreddit',
            'rising'
          ),
          controversial: createSubredditListings(
            'Controversial listings of the subreddit',
            'controversial'
          )
        }
      }),
      resolve: subreddit => subreddit
    },
    media: {
      type: new GraphQLObjectType({
        name: 'SubredditMedia',
        description: 'Only the image and video posts for this subreddit',
        fields: {
          // TODO add time argument
          hot: createSubredditMedia('Hot media posts of the subreddit', 'hot'),
          top: createSubredditMedia('Top media posts of the subreddit', 'top'),
          new: createSubredditMedia('New media posts of the subreddit', 'new'),
          rising: createSubredditMedia(
            'Rising media posts of the subreddit',
            'rising'
          ),
          controversial: createSubredditMedia(
            'Controversial media posts of the subreddit',
            'controversial'
          )
        }
      }),
      resolve: subreddit => subreddit
    }
  }
});

module.exports = subredditType;
