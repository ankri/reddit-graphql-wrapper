const fetch = require('node-fetch');
const Qs = require('qs');

const load = (url, query) => {
  const queryString = query ? `?${Qs.stringify(query)}` : '';

  return fetch(`${url}${queryString}`).then(response => response.json());
};

const loadSubreddit = name => load(`https://reddit.com/r/${name}/about.json`);

const loadSubredditListings = (
  name,
  listingsType = 'hot',
  { limit, after, before, timeInterval }
) => {
  return load(`https://reddit.com/r/${name}/${listingsType}.json`, {
    limit,
    after,
    before,
    t: timeInterval
  });
};

const loadUser = name => load(`https://reddit.com/user/${name}.json`);

const loadRandomSubreddit = async (isNsfw = false) => {
  const url = `https://reddit.com/r/${isNsfw ? 'randnsfw' : 'random'}.json`;
  const redditResponse = await fetch(url);
  const json = await redditResponse.json();
  return json.data.children[0].data.subreddit;
};

module.exports = {
  loadSubreddit,
  loadSubredditListings,
  loadUser,
  loadRandomSubreddit
};
