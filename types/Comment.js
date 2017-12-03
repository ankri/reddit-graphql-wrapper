const {
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLInt
} = require('graphql');
const { authorType, author } = require('./Author');
const { loadComments } = require('../reddit-api');

const commentType = new GraphQLObjectType({
  name: 'RedditComment',
  description: 'A reddit comment',
  fields: () => ({
    author: {
      description: 'The author of the comment',
      type: new GraphQLNonNull(authorType),
      resolve: comment => comment.data.author
    },
    body: {
      description: 'The body of the comment',
      type: new GraphQLNonNull(GraphQLString),
      resolve: comment => comment.data.body
    },
    bodyHtml: {
      description: 'The body as HTML',
      type: new GraphQLNonNull(GraphQLString),
      resolve: comment => comment.data.body_html
    },
    createdISO: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Creation date of the comment in ISO8061',
      resolve: comment => {
        const date = new Date(comment.data.created_utc * 1000);
        return date.toISOString();
      }
    },
    depth: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The depth of the comment',
      resolve: comment => comment.data.depth
    },
    gilded: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Number of times the comments has been gilded',
      resolve: comment => comment.data.gilded
    },
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of the comment',
      resolve: comment => comment.data.id
    },
    isSubmitter: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description:
        'Is the author of the comment the same as the author of the post?',
      resolve: comment => comment.data.is_submitter
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The name of the comment',
      resolve: comment => comment.data.name
    },
    permalink: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The permalink to this comment',
      resolve: comment => `https://reddit.com${comment.data.permalink}`
    },
    postId: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of the post the comment was made on',
      resolve: comment => comment.data.link_id
    },
    score: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The score of the comment',
      resolve: comment => comment.data.score
    },
    replies: {
      description: 'Replies to the comment',
      type: new GraphQLList(commentType),
      args: {
        depth: {
          type: GraphQLInt,
          description: 'Maximum depth of subtrees for the threads'
        },
        limit: {
          type: GraphQLInt,
          description: 'Maximum number of comments to return'
        }
      },
      resolve: async (comment, args) => {
        const maybeReplies = comment.data.replies;
        if (maybeReplies) {
          return maybeReplies.data.children;
        } else {
          return null;
        }
      }
    }
  })
});

module.exports = {
  commentType
};
