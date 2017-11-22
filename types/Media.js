const {
  GraphQLID,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean
} = require('graphql');
const Vibrant = require('node-vibrant');
const { isImage } = require('../mediaExtractors/utils');
const { imageColorsType } = require('./ImageColors');
const postFields = require('./PostFields');
const { author } = require('./Author');
const { isImgurAlbum } = require('../mediaExtractors/imgur');
const {
  extractAlbumFromPost,
  extractMediaFromPost
} = require('../mediaExtractors');

// is used for the image/video and its thumbnail
const sharedFields = {
  height: {
    type: GraphQLInt,
    description: 'The height of the image/video in px',
    resolve: resource => resource.height
  },
  width: {
    type: GraphQLInt,
    description: 'The width of the image/video in px',
    resolve: resource => resource.width
  },
  colors: {
    description: 'The colors of the image according to Vibrant.js',
    type: imageColorsType,
    resolve: resource => {
      // Recommended: use thumbnail to find colors
      // using Vibrant on the original image can add seconds to the request
      if (isImage(resource.url)) {
        return Vibrant.from(resource.url).getPalette();
      } else {
        return null;
      }
    }
  },
  url: {
    type: new GraphQLNonNull(GraphQLString),
    description: 'The URL to the resource',
    resolve: resource => resource.url
  }
};

const mediaElementType = new GraphQLObjectType({
  name: 'Media',
  description: 'An image or video',
  fields: {
    ...sharedFields,
    isVideo: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Is the resource a video or an image?',
      resolve: resource => resource.isVideo
    },
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'The id of the resource',
      resolve: resource => resource.id
    },
    preview: {
      description: 'The preview image for the resource. If available.',
      type: new GraphQLObjectType({
        name: 'MediaPreview', // TODO rename
        description: 'The preview image for the resource',
        fields: {
          ...sharedFields
        }
      }),
      resolve: resource => resource.preview
    }
  }
});

const mediaType = new GraphQLObjectType({
  name: 'RedditMediaPost',
  description: 'A post containing media',
  fields: {
    author,
    ...postFields,
    media: {
      type: new GraphQLList(mediaElementType),
      description:
        'The media for this post: A list containing image(s) and/or video(s)',
      resolve: element => {
        const post = {
          ...element.data,
          // always load data via https
          url: element.data.url.replace('http:', 'https:')
        };
        if (isImgurAlbum(post)) {
          return extractAlbumFromPost(post);
        } else {
          return [extractMediaFromPost(post)];
        }
      }
    }
  }
});

module.exports = {
  mediaType
};
