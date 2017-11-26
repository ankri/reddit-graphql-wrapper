const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList
} = require('graphql');

const { mediaType } = require('./Media');
const { loadSubredditListings } = require('../reddit-api');
const { isImage, isVideo, isMediaDomain } = require('../mediaExtractors/utils');

const isMedia = ({ data: { domain, url } }) => {
  const isFromMediaDomain = isMediaDomain(domain);
  const isMedia = isImage(url) || isVideo(url);

  return isFromMediaDomain || isMedia;
};

const createMediaListingsType = (description, listingType) => {
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
    }
  };

  return {
    args,
    description,
    type: new GraphQLNonNull(new GraphQLList(mediaType)),
    resolve: (subreddit, args) =>
      loadSubredditListings(
        subreddit.data.display_name,
        listingType,
        args
      ).then(listing => listing.data.children.filter(isMedia))
  };
};

module.exports = createMediaListingsType;
