const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLList,
  GraphQLBoolean
} = require('graphql');

// ignore other fields of preview: resolutions and variants because you always get a 401 when requesting them
// only load source
const imageType = new GraphQLObjectType({
  name: 'Image',
  description: 'An image',
  fields: {
    height: {
      type: GraphQLInt,
      description: 'Image height',
      resolve: image => image.source.height
    },
    width: {
      type: GraphQLInt,
      description: 'Image width',
      resolve: image => image.source.width
    },
    url: {
      type: GraphQLString,
      description: 'Image Url',
      resolve: image => image.source.url
    }
  }
});

const previewType = new GraphQLObjectType({
  name: 'Preview',
  descriptiong: 'The preview object',
  fields: {
    isEnabled: {
      type: GraphQLBoolean,
      description:
        'Is the preview enabled for this post? Even if the preview is disabled there can be images inside',
      resolve: preview => preview.enabled
    },
    images: {
      type: new GraphQLList(imageType),
      description: 'The list of images',
      resolve: preview => preview.images
    }
  }
});

const postFields = {
  // TODO add comments
  created: {
    type: new GraphQLNonNull(GraphQLFloat),
    description: 'Creation date of the post in Unix Time (UTC)',
    resolve: post => post.data.created
  },
  createdISO: {
    type: new GraphQLNonNull(GraphQLString),
    description: 'Creation date of the post in ISO8061',
    resolve: post => {
      const date = new Date(post.data.created_utc * 1000);
      return date.toISOString();
    }
  },
  domain: {
    description:
      'the domain of this link. Self posts will be self.<subreddit> while other examples include en.wikipedia.org and s3.amazon.com',
    type: new GraphQLNonNull(GraphQLString),
    resolve: post => post.data.domain
  },
  id: {
    description: 'The id of the post',
    type: new GraphQLNonNull(GraphQLString),
    resolve: post => post.data.id
  },
  isLocked: {
    description: 'whether the link is locked (closed to new comments) or not.',
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
  numberOfComments: {
    description: 'The number of comments for this post',
    type: new GraphQLNonNull(GraphQLInt),
    resolve: post => post.data.num_comments
  },
  permalink: {
    description: 'relative URL of the permanent link for this link',
    type: new GraphQLNonNull(GraphQLString),
    resolve: post => post.data.permalink
  },
  postHint: {
    description: 'The post hint of the post',
    type: new GraphQLNonNull(GraphQLString),
    resolve: post => post.data.post_hint
  },
  preview: {
    type: previewType,
    description: 'The preview object for this post',
    resolve: post => post.data.preview
  },
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
  subreddit: {
    description: 'The name of the subreddit the post was made in',
    type: new GraphQLNonNull(GraphQLString),
    resolve: post => post.data.subreddit
  },
  thumbnail: {
    description: "The post's thumbnail",
    // Chore: use the image type instead
    type: new GraphQLObjectType({
      name: 'Thumbnail',
      description: 'The thumbnail',
      fields: {
        url: {
          type: GraphQLString,
          description: 'The url of the thumbnail',
          resolve: post => post.thumbnail
        },
        width: {
          type: GraphQLInt,
          description: 'The width of the thumbnail',
          resolve: post => post.thumbnail_width
        },
        height: {
          type: GraphQLInt,
          description: 'The height of the thumbnail',
          resolve: post => post.thumbnail_height
        }
      }
    }),
    resolve: post => post.data
  },
  title: {
    description: 'The title of the post',
    type: new GraphQLNonNull(GraphQLString),
    resolve: post => post.data.title
  },
  url: {
    description: 'the link of this post. the permalink if this is a self-post',
    type: new GraphQLNonNull(GraphQLString),
    resolve: post => post.data.url
  }
};

module.exports = postFields;
