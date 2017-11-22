const { getImageFromPost, isImage } = require('./utils');

module.exports = function(post) {
  if (isImage(post.url)) {
    return getImageFromPost(post);
  }

  console.log(`[default] Could not extract: ${post.url}`);
  return null;
};
