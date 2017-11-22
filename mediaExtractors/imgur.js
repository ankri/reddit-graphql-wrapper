const fetch = require('node-fetch');
const { getVideoFromPost, getImageFromPost } = require('./utils');

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
    thumbnail: data.link
      .replace('.jpg', 'b.jpg')
      .replace('.png', 'b.png')
      .replace('.jpeg', 'b.jpeg'),
    thumbnail_width: 160,
    thumbnail_height: 160
  };

  if (data.type.includes('video')) {
    return getVideoFromPost(media);
  } else {
    return getImageFromPost(media);
  }
};

// https://api.imgur.com/3/album/{id}/images
const imgurAlbumExtractor = async post => {
  if (
    !process.env.IMGUR_CLIENT_ID ||
    process.env.IMGUR_CLIENT_ID.length === 0
  ) {
    console.error(
      `Need imgur API access to access albums under url: ${post.url}`
    );
    return '';
  } else {
    const imgurId = post.url.split('/')[post.url.split('/').length - 1];
    if (!imgurId || imgurId.length === 0) {
      console.warn(`Error extracting id from ${post.url}`);
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
      return album;
    }
  }
};

const imgurExtractor = async post => {
  const url = post.url
    .replace('.gif', '')
    .replace('.png', '')
    .replace('.jpg', '')
    .replace('.jpeg', '');

  if (
    !process.env.IMGUR_CLIENT_ID ||
    process.env.IMGUR_CLIENT_ID.length === 0
  ) {
    console.error(`Need imgur API access to access albums under url: ${url}`);
    return null;
  } else {
    try {
      const imgurId = url.split('/')[url.split('/').length - 1];
      console.log(`[imgur] Loading with API: ${imgurId}`);

      const response = await fetch(`https://api.imgur.com/3/image/${imgurId}`, {
        headers: {
          authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`
        }
      });

      const json = await response.json();
      return imgurDataToMedia(json);
    } catch (e) {
      console.error(e);
      return e;
    }
  }
};

const imgurResourceExtractor = async post => {
  // TODO replace with regular expression that also matches ?...
  if (
    post.url.toLowerCase().endsWith('.gifv') ||
    post.url.toLowerCase().endsWith('.gif') // TODO does not seem to work -> load gif via api
  ) {
    // no need to call the api to get the video
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
