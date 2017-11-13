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
    swatches: {
      type: new GraphQLObjectType({
        name: 'Swatches',
        description: 'Image colors according to vibrant.js',
        fields: {
          vibrant: {
            type: GraphQLString,
            description: 'Vibrant color',
            resolve: palette => palette.Vibrant.getHex().toString()
          },
          darkVibrant: {
            type: GraphQLString,
            description: 'Dark vibrant color',
            resolve: palette => palette.DarkVibrant.getHex().toString()
          },
          lightVibrant: {
            type: GraphQLString,
            description: 'Light vibrant color',
            resolve: palette => palette.LightVibrant.getHex().toString()
          },
          darkMuted: {
            type: GraphQLString,
            description: 'Dark Muted color',
            resolve: palette => palette.DarkMuted.getHex().toString()
          },
          lightMuted: {
            type: GraphQLString,
            description: 'Light Muted color',
            resolve: palette => palette.LightMuted.getHex().toString()
          },
          muted: {
            type: GraphQLString,
            description: 'Muted color',
            resolve: palette => palette.Muted.getHex().toString()
          }
        }
      }),
      name: 'Swatches',
      resolve: post => {
        const url = post.data.url;
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
