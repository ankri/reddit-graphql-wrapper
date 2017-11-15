const gfycatExtractor = require('../mediaExtractors/gfycat');
const {
  imgurImageExtractor,
  imgurAlbumExtractor
} = require('../mediaExtractors/imgur');
const redditExtractor = require('../mediaExtractors/reddit');

const isInOneOf = (array, text) =>
  array.filter(value => text.toLowerCase().includes(value)).length > 0;

const isVideo = url => isInOneOf(['.gifv', '.mp4', '.webm'], url);

const isImage = url =>
  !url.includes('.gifv') && isInOneOf(['.jpg', '.jpeg', '.png', '.gif'], url);

const isVideoDomain = url => isInOneOf(['gfycat'], url);

const isMediaDomain = domain =>
  isInOneOf(['imgur', 'gfycat', 'i.redd.it'], domain);

const isAlbum = url => {
  const isImgurAlbum =
    url.includes('imgur') && isInOneOf(['/a/', '/gallery/'], url);

  return isImgurAlbum;
};

const extractMediaFromUrl = ({ url, preview }) => {
  if (isImage(url)) {
    return url;
  } else {
    if (url.toLowerCase().includes('gfycat.com')) {
      return gfycatExtractor(url);
    } else if (url.toLowerCase().includes('imgur')) {
      // Try to minimize the api calls by looking at the url and preview saved in reddit's response
      const redditMedia = redditExtractor(url, preview);
      // Didn't find an image on reddit -> try imgur api
      return redditMedia || imgurImageExtractor(url);
    } else if (url.toLowerCase().includes('i.redd.it')) {
      return redditExctractor(url, preview);
    }

    console.log(url);
    return 'not yet supported';
  }
};

const extractAlbumFromUrl = url => {
  if (isAlbum(url)) {
    if (url.toLowerCase().includes('imgur')) {
      return imgurAlbumExtractor(url);
    } else {
      console.log(`Not supported: ${url}`);
      return url;
    }
  }
  return null;
};

module.exports = {
  isVideo,
  isVideoDomain,
  isImage,
  isMediaDomain,
  isAlbum,
  extractMediaFromUrl,
  extractAlbumFromUrl
};
