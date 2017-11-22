const { getImageFromPost } = require('./utils');

module.exports = function(post) {
  return getImageFromPost({ ...post, url: post.preview.images[0].source.url });
};
