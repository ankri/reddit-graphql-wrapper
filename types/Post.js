const {
  GraphQLObjectType,
  GraphQLEnumType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList
} = require('graphql');
const { commentType } = require('./Comment');
const { author } = require('./Author');
const postFields = require('./PostFields');
const { loadComments } = require('../reddit-api');

const commentSortType = new GraphQLEnumType({
  name: 'CommentSorting',
  description: 'This is how the comments will be sorted',
  values: {
    best: {
      description: 'best/confidence',
      value: 'confidence'
    },
    top: {
      value: 'top'
    },
    new: {
      value: 'new'
    },
    controversial: {
      value: 'controversial'
    },
    old: {
      value: 'old'
    },
    random: {
      value: 'random'
    },
    qa: {
      value: 'qa'
    },
    live: {
      value: 'live'
    }
  }
});

const postType = new GraphQLObjectType({
  name: 'RedditPost',
  description: 'A post made on a subreddit',
  fields: {
    author,
    comments: {
      type: new GraphQLNonNull(new GraphQLList(commentType)),
      description: 'The comments for this post',
      args: {
        depth: {
          type: GraphQLInt,
          description: 'Maximum depth of subtrees for the threads'
        },
        limit: {
          type: GraphQLInt,
          description: 'Maximum number of comments to return'
        },
        sort: {
          type: commentSortType,
          description: 'This is how the comments will be sorted'
        }
      },
      resolve: async (post, args) => {
        const commentsListing = await loadComments(
          post.data.subreddit,
          post.data.id,
          args
        );
        return commentsListing[1].data.children;
      }
    },
    ...postFields
  }
});

module.exports = {
  postType
};
