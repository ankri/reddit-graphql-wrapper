const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLBoolean
} = require('graphql');

const postType = new GraphQLObjectType({
  name: 'RedditPost',
  description: 'A post made on a subreddit',
  fields: {
    author: {
      description:
        'the account name of the poster. null if this is a promotional link',
      type: GraphQLString,
      resolve: post => post.data.author
    },
    // created,
    // created_utc,
    domain: {
      description:
        'the domain of this link. Self posts will be self.<subreddit> while other examples include en.wikipedia.org and s3.amazon.com',
      type: new GraphQLNonNull(GraphQLString),
      resolve: post => post.data.domain
    },
    // downs
    // gilded
    id: {
      description: 'The id of the post',
      type: new GraphQLNonNull(GraphQLString),
      resolve: post => post.data.id
    },
    isLocked: {
      description:
        'whether the link is locked (closed to new comments) or not.',
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: post => post.data.locked
    },
    isNsfw: {
      description: 'Is the post marked as nsfw?',
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: post => post.data.over_18
    },
    isPinned: {
      description: 'Is the post pinned?',
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: post => post.data.pinned
    },
    isSelf: {
      description: 'true if this link is a selfpost',
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: post => post.data.is_self
    },
    isVideo: {
      description: 'Is the post a link to a video?',
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: post => post.data.is_video
    },
    name: {
      description: 'The name of the post',
      type: new GraphQLNonNull(GraphQLString),
      resolve: post => post.data.name
    },
    // num_comments
    permalink: {
      description: 'relative URL of the permanent link for this link',
      type: new GraphQLNonNull(GraphQLString),
      resolve: post => post.data.perma_link
    },
    postHint: {
      description: 'The post hint of the post',
      type: new GraphQLNonNull(GraphQLString),
      resolve: post => post.data.post_hint
    },
    // preview !
    score: {
      description:
        'the net-score of the link. note: A submission\'s score is simply the number of upvotes minus the number of downvotes. If five users like the submission and three users don\'t it will have a score of 2. Please note that the vote numbers are not "real" numbers, they have been "fuzzed" to prevent spam bots etc. So taking the above example, if five users upvoted the submission, and three users downvote it, the upvote/downvote numbers may say 23 upvotes and 21 downvotes, or 12 upvotes, and 10 downvotes. The points score is correct, but the vote totals are "fuzzed".',
      type: new GraphQLNonNull(GraphQLInt),
      resolve: post => post.data.score
    },
    selfText: {
      description:
        'the raw text. this is the unformatted text which includes the raw markup characters such as ** for bold. <, >, and & are escaped. Empty if not present',
      type: new GraphQLNonNull(GraphQLString),
      resolve: post => post.data.selftext
    },
    // subreddit? - subreddit_i subreddit_name ?
    // thumbnail ?
    title: {
      description: 'The title of the post',
      type: new GraphQLNonNull(GraphQLString),
      resolve: post => post.data.title
    },
    // ups
    url: {
      description:
        'the link of this post. the permalink if this is a self-post',
      type: new GraphQLNonNull(GraphQLString),
      resolve: post => post.data.url
    }
  }
});

module.exports = postType;
