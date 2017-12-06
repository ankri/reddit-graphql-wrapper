const {
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean
} = require('graphql');

const { loadUserPosts, loadUserComments } = require('../reddit-api');
const postFields = require('./PostFields');
const { mediaType } = require('./Media');
const { commentType } = require('./Comment');
const { isImage, isVideo, isMediaDomain } = require('../mediaExtractors/utils');

const isMedia = ({ data: { domain, url } }) => {
  const isFromMediaDomain = isMediaDomain(domain);
  const isMedia = isImage(url) || isVideo(url);

  return isFromMediaDomain || isMedia;
};

const userType = new GraphQLObjectType({
  name: 'User',
  description: 'Comments, posts and media posted by a reddit user',
  fields: {
    comments: {
      type: new GraphQLList(commentType),
      description: 'The comments made by the user',
      resolve: async ({ username, ...args }) => {
        const json = await loadUserComments(username, args);
        const listing = await json.data.children;
        return listing.filter(data => data.kind === 't1');
      }
    },
    posts: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: 'UserPost',
          description: 'A post made by the user',
          fields: postFields
        })
      ),
      description: 'The posts made by the user',
      resolve: async ({ username, ...args }) => {
        const json = await loadUserPosts(username, args);
        const listing = await json.data.children;
        return listing.filter(data => data.kind === 't3');
      }
    },
    media: {
      type: new GraphQLList(mediaType),
      description: 'Only the images and videos posted by this user',
      resolve: async ({ username, ...args }) => {
        const json = await loadUserPosts(username, args);
        const listing = await json.data.children;
        return listing.filter(data => data.kind === 't3').filter(isMedia);
      }
    }
  }
});

module.exports = userType;
