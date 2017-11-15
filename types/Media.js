const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList
} = require('graphql');

const { mediaType } = require('./Post');
const { loadSubredditListings } = require('../reddit-api');
const { isImage, isVideo, isMediaDomain } = require('../utils/Utils');

const mediaFilter = ({ data: { domain, url } }) => {
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
        args.limit
      ).then(listing => listing.data.children.filter(mediaFilter))
  };
};

module.exports = createMediaListingsType;
