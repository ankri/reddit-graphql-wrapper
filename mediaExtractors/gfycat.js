const fetch = require('node-fetch');
const Gfycat = require('gfycat-sdk');
const { getVideoFromPost } = require('./utils');

let gfycat;

const loadWithAPI = async gfycatId => {
  console.log(`[gfycat] Loading with API: ${gfycatId}`);

  if (!process.env.GFYCAT_CLIENT_ID || !process.env.GFYCAT_CLIENT_SECRET) {
    console.error('No gfycat credentials found. Go to: ...'); // TODO add gfycat api key url
    return '';
  } else {
    try {
      if (!gfycat) {
        gfycat = new Gfycat({
          clientId: process.env.GFYCAT_CLIENT_ID,
          clientSecret: process.env.GFYCAT_CLIENT_SECRET
        });
      }

      const details = await gfycat.getGifDetails({
        gfyId: gfycatId
      });

      return details.gfyItem.mp4Url;
    } catch (e) {
      console.error(e);
      return null;
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

  if (url === url.toLowerCase()) {
    const id = url.split('/')[url.split('/').length - 1];
    console.log(`[gfycat] load with API ${id}`);
    return null;
  } else {
    const cleanUrl = url
      .replace('https://gfycat.com', 'https://giant.gfycat.com')
      .replace('https://thumbs.gfycat.com', 'https://giant.gfycat.com')
      .replace('-size_restricted.gif', '')
      .replace('/gifs/detail/', '')
      .replace('.mp4', '')
      .replace('.webm', '')
      .concat('.mp4');

    try {
      const response = await fetch(cleanUrl);
      if (response.status === 200) {
        return getVideoFromPost({ ...post, url: cleanUrl });
      } else {
        console.log(`[gfycat] load with API ${id}`);
        return null;
      }
    } catch (e) {
      const id = url
        .replace('https://giant.gfycat.com/', '')
        .replace('.mp4', '');
      console.log(`[gfycat] load with API ${id}`);

      return null;
    }
  }
};

module.exports = {
  gfycatExtractor,
  gfycatResourceExtractor
};
