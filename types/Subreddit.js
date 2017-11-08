const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean
} = require('graphql');

const createSubredditListings = require('./PostListing');

const subredditType = new GraphQLObjectType({
  name: 'Subreddit',
  description: 'Information about the subreddit',
  fields: {
    activeAccounts: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The currently active accounts on the subreddit',
      resolve: subreddit => subreddit.data.accounts_active
    },
    activeUserCount: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The currently active users on the subreddit',
      resolve: subreddit => subreddit.data.active_user_coount
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The name of the subreddit',
      resolve: subreddit => subreddit.data.display_name
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The title of the subreddit',
      resolve: subreddit => subreddit.data.title
    },
    publicDescription: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The public description of the subreddit',
      resolve: subreddit => subreddit.data.public_description
    },
    description: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The description of the subreddit',
      resolve: subreddit => subreddit.data.description
    },
    headerImage: {
      type: new GraphQLObjectType({
        name: 'HeaderImage',
        fields: {
          url: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'Image url',
            resolve: data => data.header_img
          },
          width: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'Image width',
            resolve: data => data.header_size[0]
          },
          height: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'Image height',
            resolve: data => data.header_size[1]
          }
        }
      }),
      description: "The subreddit's header image",
      resolve: subreddit => subreddit.data
    },
    headerIcon: {
      type: new GraphQLObjectType({
        name: 'HeaderIcon',
        fields: {
          url: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'Icon url',
            resolve: data => data.icon_img
          },
          width: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'Icon width',
            resolve: data => data.icon_size[0]
          },
          height: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'Icon height',
            resolve: data => data.icon_size[1]
          }
        }
      }),
      description: "The subreddit's header image",
      resolve: subreddit => subreddit.data
    },
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of the subreddit',
      resolve: subreddit => subreddit.data.id
    },
    isNsfw: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Is the subreddit marked as nsfw?',
      resolve: subreddit => subreddit.data.over_18
    },
    subscribers: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The subscribers for this subreddit',
      resolve: subreddit => subreddit.data.subscribers
    },
    listings: {
      type: new GraphQLObjectType({
        name: 'SubredditListings',
        fields: {
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
      description: 'The listings for this subreddit',
      resolve: subreddit => subreddit
    }
  }
});

module.exports = subredditType;
