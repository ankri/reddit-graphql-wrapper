const fetch = require('node-fetch');
const Gfycat = require('gfycat-sdk');
const NodeCache = require('node-cache');
const { getVideoFromPost } = require('./utils');
const gfycatCache = new NodeCache({
  stdTTL: process.env.CACHE_DURATION || 60 * 60 * 24
});

let gfycat;

const loadWithAPI = async gfycatId => {
  console.log(`[gfycat] Loading with API: ${gfycatId}`);

  if (!process.env.GFYCAT_CLIENT_ID || !process.env.GFYCAT_CLIENT_SECRET) {
    console.error('No gfycat credentials found. Go to: ...'); // TODO add gfycat api key url
    return null;
  } else {
    const fromCache = gfycatCache.get(gfycatId);
    if (fromCache) {
      return fromCache;
    } else {
      try {
        if (!gfycat) {
          gfycat = new Gfycat({
            clientId: process.env.GFYCAT_CLIENT_ID,
            clientSecret: process.env.GFYCAT_CLIENT_SECRET
          });
        }

        const details = await gfycat.getGifDetails({
          gfyId: gfycatId.replace('https://gfycat.com/', '')
        });

        const gfycatVideo = getVideoFromPost({
          id: details.gfyItem.gfyName,
          url: details.gfyItem.mp4Url,
          preview: {
            images: [
              {
                source: {
                  height: details.gfyItem.height,
                  width: details.gfyItem.width
                }
              }
            ]
          },
          thumbnail: details.gfyItem.thumb100PosterUrl,
          thumbnail_width: 100,
          thumbnail_height: 100
        });

        gfycatCache.set(gfycatId, gfycatVideo);
        return gfycatVideo;
      } catch (e) {
        console.error(e);
        gfycatCache.set(gfycatId, null);
        return null;
      }
    }
  }
};

const gfycatExtractor = async url => {
  if (url === url.toLowerCase()) {
    const id = url.split('/')[url.split('/').length - 1];
    return loadWithAPI(id);
  } else {
    const cleanUrl = url
      .replace('https://gfycat.com', 'https://giant.gfycat.com')
      .replace('/gifs/detail/', '')
      .replace('.mp4', '')
      .replace('.webm', '')
      .concat('.mp4');

    try {
      const response = await fetch(cleanUrl);
      if (response.status === 200) {
        return cleanUrl;
      } else {
        const id = url
          .replace('https://giant.gfycat.com/', '')
          .replace('https://gfycat.com/', '')
          .replace('.mp4', '');
        return loadWithAPI(id);
      }
    } catch (e) {
      const id = url
        .replace('https://giant.gfycat.com/', '')
        .replace('.mp4', '');
      return loadWithAPI(id);
    }
  }
};

const gfycatResourceExtractor = async post => {
  const url = post.url;

  // cannot load the video directly if the id is all lowercase
  if (url === url.toLowerCase()) {
    const id = url.split('/')[url.split('/').length - 1];
    console.log(`[gfycat] load with API ${id}`);
    return loadWithAPI(id);
  } else {
    // try to clean the url as much as possible
    // TODO use regexp instead
    const cleanUrl = url
      .replace('https://gfycat.com', 'https://giant.gfycat.com')
      .replace('https://thumbs.gfycat.com', 'https://giant.gfycat.com')
      .replace('-size_restricted.gif', '')
      .replace('/gifs/detail', '')
      .replace('.mp4', '')
      .replace('.webm', '')
      .concat('.mp4');

    try {
      const response = await fetch(cleanUrl);
      if (response.status === 200) {
        return getVideoFromPost({ ...post, url: cleanUrl });
      } else {
        const id = url
          .replace('https://giant.gfycat.com/', '')
          .replace('.mp4', '');
        return loadWithAPI(id);
      }
    } catch (e) {
      const id = url
        .replace('https://giant.gfycat.com/', '')
        .replace('.mp4', '');

      return loadWithAPI(id);
    }
  }
};

module.exports = {
  gfycatExtractor,
  gfycatResourceExtractor
};
