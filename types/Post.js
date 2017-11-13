const { GraphQLObjectType, GraphQLString } = require('graphql');
const Vibrant = require('node-vibrant');

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
    imageColors: {
      type: new GraphQLObjectType({
        name: 'ImageColors',
        description: 'Image colors according to vibrant.js',
        fields: {
          vibrant: {
            type: GraphQLString,
            description: 'Vibrant color',
            resolve: palette => palette.Vibrant.getHex().toString()
          },
          vibrantDark: {
            type: GraphQLString,
            description: 'Dark vibrant color',
            resolve: palette => palette.DarkVibrant.getHex().toString()
          },
          vibrantLight: {
            type: GraphQLString,
            description: 'Light vibrant color',
            resolve: palette => palette.LightVibrant.getHex().toString()
          },
          muted: {
            type: GraphQLString,
            description: 'Muted color',
            resolve: palette => palette.Muted.getHex().toString()
          },
          mutedDark: {
            type: GraphQLString,
            description: 'Dark Muted color',
            resolve: palette => palette.DarkMuted.getHex().toString()
          },
          mutedLight: {
            type: GraphQLString,
            description: 'Light Muted color',
            resolve: palette => palette.LightMuted.getHex().toString()
          }
        }
      }),
      name: 'ImageColors',
      resolve: post => {
        // use thumbnail to find colors
        // using vibrant on the original image can add seconds to the request
        const url =
          post.data.thumbnail && post.data.thumbnail.length > 0
            ? post.data.thumbnail
            : post.data.url;

        if (
          url.includes(
            '.jpg' ||
              url.includes('.png') ||
              url.includes('.jpeg') ||
              url.includes('.gif')
          )
        ) {
          return Vibrant.from(url).getPalette();
        }
      }
    },
    ...postFields
  }
});

module.exports = {
  postType
};
