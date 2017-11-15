const fetch = require('node-fetch');

// https://api.imgur.com/3/album/{id}/images
const imgurAlbumExtractor = async url => {
  if (
    !process.env.IMGUR_CLIENT_ID ||
    process.env.IMGUR_CLIENT_ID.length === 0
  ) {
    console.error(`Need imgur API access to access albums under url: ${url}`);
    return '';
  } else {
    const imgurId = url.split('/')[url.split('/').length - 1];
    if (!imgurId || imgurId.length === 0) {
      console.warn(`Error extracting id from ${url}`);
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
      // console.log(json);
      return '';
    }
  }
};

const imgurImageExtractor = async url => {
  if (
    !process.env.IMGUR_CLIENT_ID ||
    process.env.IMGUR_CLIENT_ID.length === 0
  ) {
    console.error(`Need imgur API access to access albums under url: ${url}`);
    return '';
  } else {
    if (url.toLowerCase().endsWith('.gifv')) {
      return url.replace('.gifv', '.mp4');
    } else {
      try {
        const imgurId = url.split('/')[url.split('/').length - 1];
        const response = await fetch(
          `https://api.imgur.com/3/image/${imgurId}`,
          {
            headers: {
              authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`
            }
          }
        );

        const json = await response.json();
        return json.data.link;
      } catch (e) {
        console.error(e);
        return e;
      }
    }
  }
};

module.exports = {
  imgurAlbumExtractor,
  imgurImageExtractor
};
