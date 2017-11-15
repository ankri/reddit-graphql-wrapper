const gfycatExtractor = require('../mediaExtractors/gfycat');
const imgurExtractor = require('../mediaExtractors/imgur');
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

const extractMediaFromUrl = url => {
  if (isImage(url)) {
    return url;
  } else {
    if (url.toLowerCase().includes('gfycat.com')) {
      return gfycatExtractor(url);
    } else if (url.toLowerCase().includes('imgur')) {
      return imgurExtractor(url);
    } else if (url.toLowerCase().includes('i.redd.it')) {
      return redditExctractor(url);
    }

    console.log(url);
    return 'not yet supported';
  }
};

module.exports = {
  isVideo,
  isVideoDomain,
  isImage,
  isMediaDomain,
  isAlbum,
  extractMediaFromUrl
};
