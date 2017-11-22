const { GraphQLObjectType, GraphQLString } = require('graphql');

const imageColorsType = new GraphQLObjectType({
  name: 'ImageColors',
  description: 'Image colors according to vibrant.js',
  fields: {
    vibrant: {
      type: GraphQLString,
      description: 'Vibrant color',
      resolve: palette => palette.Vibrant && palette.Vibrant.getHex().toString()
    },
    vibrantDark: {
      type: GraphQLString,
      description: 'Dark vibrant color',
      resolve: palette =>
        palette.DarkVibrant && palette.DarkVibrant.getHex().toString()
    },
    vibrantLight: {
      type: GraphQLString,
      description: 'Light vibrant color',
      resolve: palette =>
        palette.LightVibrant && palette.LightVibrant.getHex().toString()
    },
    muted: {
      type: GraphQLString,
      description: 'Muted color',
      resolve: palette => palette.Muted && palette.Muted.getHex().toString()
    },
    mutedDark: {
      type: GraphQLString,
      description: 'Dark Muted color',
      resolve: palette =>
        palette.DarkMuted && palette.DarkMuted.getHex().toString()
    },
    mutedLight: {
      type: GraphQLString,
      description: 'Light Muted color',
      resolve: palette =>
        palette.LightMuted && palette.LightMuted.getHex().toString()
    },
    titleText: {
      type: GraphQLString,
      description: 'The title color for the provided color',
      args: {
        color: {
          type: GraphQLString, // TODO convert to enum
          description: 'The color'
        }
      },
      resolve: (palette, args) => {
        return palette[args.color]
          ? palette[args.color].getTitleTextColor().toString()
          : '#FFF';
      }
    }
  }
});

module.exports = { imageColorsType };
