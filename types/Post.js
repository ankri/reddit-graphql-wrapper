const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList
} = require('graphql');
const Vibrant = require('node-vibrant');

const { authorType } = require('./Author');
const { imageColorsType } = require('./ImageColors');
const postFields = require('./PostFields');
const {
  isVideo,
  isVideoDomain,
  isAlbum,
  extractMediaFromUrl,
  extractAlbumFromUrl
} = require('../utils/Utils');

const author = {
  type: authorType,
  name: 'Author',
  resolve: post => post.data.author
};

const imageColors = {
  type: imageColorsType,
  name: 'ImageColors',
  resolve: post => {
    // use thumbnail to find colors
    // using vibrant on the original image can add seconds to the request
    const url =
      post.data.thumbnail && post.data.thumbnail.length > 0
        ? post.data.thumbnail
        : post.data.url;

    if (
      url.includes('.jpg') ||
      url.includes('.png') ||
      url.includes('.jpeg') ||
      url.endsWith('.gif')
    ) {
      return Vibrant.from(url).getPalette();
    } else {
      return null;
    }
  }
};

const postType = new GraphQLObjectType({
  name: 'RedditPost',
  description: 'A post made on a subreddit',
  fields: {
    author,
    imageColors,
    ...postFields
  }
});

const mediaType = new GraphQLObjectType({
  name: 'RedditMediaPost',
  description: 'A post containing media on a subreddit',
  fields: {
    author,
    imageColors,
    ...postFields,
    isVideo: {
      ...postFields.isVideo,
      resolve: post => isVideo(post.data.url) || isVideoDomain(post.data.domain)
    },
    isAlbum: {
      type: GraphQLBoolean,
      description: 'Does the post contain an url to an album?',
      resolve: post => isAlbum(post.data.url)
    },
    media: {
      type: new GraphQLObjectType({
        name: 'RedditMediaPostMedia',
        description: "The media of this post (if it's not an album)",
        fields: {
          url: {
            type: GraphQLString,
            description: 'The url of the media file',
            resolve: post => extractMediaFromUrl(post)
          },
          album: {
            type: new GraphQLList(GraphQLString),
            description: 'The album information',
            resolve: post => extractAlbumFromUrl(post.url)
          }
        }
      }),
      description: "The media of this post (if it's not an album)",
      resolve: post => post.data
    }
  }
});

module.exports = {
  postType,
  mediaType
};
