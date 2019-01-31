const fetch = require('node-fetch');
const { getVideoFromPost, getImageFromPost } = require('./utils');
const NodeCache = require('node-cache');
const imgurCache = new NodeCache({
  stdTTL: process.env.CACHE_DURATION || 60 * 60 * 24
});

const imgurDataToMedia = data => {
  const media = {
    ...data,
    url: data.link,
    preview: {
      images: [
        {
          source: {
            height: data.height,
            width: data.width
          }
        }
      ]
    },
    thumbnail:
      data.link &&
      data.link
        .replace('.jpg', 'b.jpg')
        .replace('.png', 'b.png')
        .replace('.jpeg', 'b.jpeg'),
    thumbnail_width: 160,
    thumbnail_height: 160
  };

  if (!data || !data.type) {
    return null;
  } else if (data.type.includes('video')) {
    return getVideoFromPost(media);
  } else {
    return getImageFromPost(media);
  }
};

// important: albums can only be accessed with a key
//
// strategy:
// 1. check if client id is available
// 2. extract album id from rl
// 3. check if album is already cached
// 4. load from imgur and save in cache
//
const imgurAlbumExtractor = async post => {
  if (
    !process.env.IMGUR_CLIENT_ID ||
    process.env.IMGUR_CLIENT_ID.length === 0
  ) {
    console.error(
      `Need imgur API access to access albums under url: ${
        post.url
      } Go to https://apidocs.imgur.com/ to get a key`
    );
    return '';
  } else {
    const imgurId = post.url.split('/')[post.url.split('/').length - 1];
    if (!imgurId || imgurId.length === 0) {
      console.warn(`Error extracting id from ${post.url}`);
    } else {
      console.log(`[imgur] Loading album ${imgurId}`);
      const albumFromCache = imgurCache.get(imgurId);
      if (albumFromCache) {
        return albumFromCache;
      } else {
        const response = await fetch(
          `https://api.imgur.com/3/album/${imgurId}/images`,
          {
            headers: {
              Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`
            }
          }
        );
        const json = await response.json();
        const album = json.data.map(image => imgurDataToMedia(image));
        imgurCache.set(imgurId, album);
        return album;
      }
    }
  }
};

// is used when image / video could not be accessed without imgur API
//
// 1. clean url
// 2. check if client id is available
// 3. extract image id from rl
// 4. check if image is already cached
// 5. load from imgur and save in cache
//
const imgurExtractor = async post => {
  // TODO replace id extraction with a regexp
  const url = post.url
    .replace('.gif', '')
    .replace('.png', '')
    .replace('.jpg', '')
    .replace('.jpeg', '');

  if (
    !process.env.IMGUR_CLIENT_ID ||
    process.env.IMGUR_CLIENT_ID.length === 0
  ) {
    console.error(
      `Need imgur API access to access images for url: ${
        url
      } Go to https://apidocs.imgur.com/ to get a key`
    );
    return null;
  } else {
    const imgurId = url.split('/')[url.split('/').length - 1];
    console.log(`[imgur] Loading with API: ${imgurId}`);

    const imageFromCache = imgurCache.get(imgurId);
    if (imageFromCache) {
      return imageFromCache;
    } else {
      try {
        const response = await fetch(
          `https://api.imgur.com/3/image/${imgurId}`,
          {
            headers: {
              authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`
            }
          }
        );

        const json = await response.json();
        const image = imgurDataToMedia(json.data);
        imgurCache.set(imgurId, image);
        return image;
      } catch (e) {
        console.error(e);
        imgurCache.set(imgurId, null);
        return null;
      }
    }
  }
};

const imgurResourceExtractor = post => {
  // TODO replace with regular expression that also matches ?...
  if (
    post.url.toLowerCase().endsWith('.gifv') ||
    post.url.toLowerCase().endsWith('.gif') // TODO does not seem to work -> load gif via api
  ) {
    // filetype is gif(v) -> we know it's a video
    // no need to call the api
    return getVideoFromPost({
      ...post,
      url: post.url.replace('gifv', 'mp4').replace('gif', 'mp4')
    });
  } else {
    return imgurExtractor(post);
  }
};

const isImgurAlbum = post => {
  return (
    post.domain.includes('imgur') &&
    new RegExp('(/a/|/gallery/)', 'gi').test(post.url)
  );
};

module.exports = {
  imgurAlbumExtractor,
  imgurResourceExtractor,
  isImgurAlbum
};
