const { getImageFromPost } = require('./utils');

module.exports = function(post) {
  if (post.preview) {
    return getImageFromPost({
      ...post,
      url: post.preview.images[0].source.url
    });
  } else {
    return null;
  }
};
