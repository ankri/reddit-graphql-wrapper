const imgurExtractor = url => {
  if (url.toLowerCase().endsWith('.gifv')) {
    return url.replace('.gifv', '.mp4');
  } else {
    console.log(url);
    return `API: ${url}`;
  }
};

module.exports = imgurExtractor;
