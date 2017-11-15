const fetch = require('node-fetch');

let gfycat;

const loadWithAPI = async gfycatId => {
  if (!process.env.GFYCAT_CLIENT_ID || !process.env.GFYCAT.CLIENT_SECRET) {
    console.error('No gfycat credentials found. Go to: ...'); // TODO add gfycat api key url
    return '';
  } else {
    if (!gfycat) {
      gfycat = new Gfycat({
        clientId: process.env.GFYCAT_CLIENT_ID,
        clientSecret: process.env.GFYCAT.CLIENT_SECRET
      });
    }
    const details = await gfycat.getGifDetails({
      gfyId: gfycatId
    });

    return details.gfyItem.mp4Url;
  }
};

const gfycatExtractor = async url => {
  if (url === url.toLowerCase()) {
    const id = url.split('/')[url.split('/').length - 1];
    console.log(`Loading with API: ${id}`);
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
          .replace('.mp4', '');
        console.log(`Loading with API: ${id}`);
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

module.exports = gfycatExtractor;
