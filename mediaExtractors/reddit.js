const redditExtractor = (url, { images }) => {
  if (images.length >= 1) {
    // Are there any imgur images that have more than one source image on reddit?
    if (images.length > 1) {
      console.warn(`Reddit: has more images ${url} - ${images.length}`);
    }

    // images[0].source.height
    // images[0].source.width
    const redditUrl = images[0].source.url;

    // Cannot load gifs from reddit (response: 403)
    if (redditUrl.includes('.gif')) {
      return null;
    } else {
      return redditUrl;
    }
  }

  console.log(`Reddit: unknown url: ${url}`);
  return null;
};

module.exports = redditExtractor;
