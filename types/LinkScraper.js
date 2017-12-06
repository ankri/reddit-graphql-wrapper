const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean
} = require('graphql');

const { loadComments } = require('../reddit-api');

const LinkType = new GraphQLObjectType({
  name: 'Link',
  description: '',
  fields: {
    url: {
      type: GraphQLString,
      description: 'The url of the link',
      resolve: link => link.url
    },
    title: {
      type: GraphQLString,
      description: 'The title of the link',
      resolve: link => link.title
    },
    score: {
      type: GraphQLInt,
      description: 'The score of the comment',
      resolve: link => link.score
    },
    author: {
      type: GraphQLString,
      description: 'The author of the comment',
      resolve: link => link.author
    },
    isSubmitter: {
      type: GraphQLBoolean,
      description:
        'Is the author of the comment with the url the author of the original post?',
      resolve: link => link.isSubmitter
    }
  }
});

const linkScraper = {
  type: new GraphQLList(LinkType),
  description: 'The links from the top level comments of a post',
  resolve: async post => {
    const data = await loadComments(post.data.subreddit, post.data.id, {
      threaded: false
    });
    const comments = data[1].data.children;
    return comments
      .map(comment => {
        const regex = /.*href="(.*)"&gt;(.*)&lt;\/a&gt;.*/g;
        const match = regex.exec(comment.data.body_html);
        if (match) {
          return {
            url: match[1],
            title: match[2],
            score: comment.data.score,
            author: comment.data.author,
            isSubmitter: comment.data.is_submitter
          };
        } else {
          return null;
        }
      })
      .filter(link => link !== null);
  }
};

module.exports = {
  linkScraper
};
