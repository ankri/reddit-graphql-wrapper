const getResourceFromPost = (
  { preview, url, id, thumbnail_height, thumbnail_width, thumbnail },
  isVideo
) => {
  return {
    height:
      preview && preview.images.length > 0 && preview.images[0].source
        ? preview.images[0].source.height
        : null,
    width:
      preview && preview.images.length > 0 && preview.images[0].source
        ? preview.images[0].source.width
        : null,
    url,
    isVideo,
    id: `${isVideo ? 'video-' : 'image-'}${id}`,
    preview: {
      height: thumbnail_height,
      width: thumbnail_width,
      url: thumbnail
    }
  };
};

const getImageFromPost = post => getResourceFromPost(post, false);

const getVideoFromPost = post => getResourceFromPost(post, true);

// starts with any character
// contains .jpg, .jpeg, .gif or .png
// ends there or ends with ? and any characters
const isImage = url =>
  new RegExp('^.*.(jpe?g|gif|png)(\\?.*)?$', 'i').test(url);

// starts with any character
// contains .gifv, .mp4 or .webm
// ends there or ends with ? and any characters
const isVideo = url =>
  new RegExp('^.*.(gifv|mp4|webm)(\\?.*)?$', 'i').test(url);

const isMediaDomain = domain =>
  new RegExp('^.*(imgur|i.redd.it|gfycat).*$', 'i').test(domain);

module.exports = {
  getImageFromPost,
  getVideoFromPost,
  isImage,
  isVideo,
  isMediaDomain
};
