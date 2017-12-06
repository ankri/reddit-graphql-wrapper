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
) =>
  load(`https://reddit.com/r/${name}/${listingsType}.json`, {
    limit,
    after,
    before,
    t: timeInterval
  });

const loadUser = name => load(`https://reddit.com/user/${name}.json`);

const loadUserPosts = (name, { limit, after }) =>
  load(`https://reddit.com/user/${name}/submitted.json`, { limit, after });
const loadUserComments = (name, { limit, after }) =>
  load(`https://reddit.com/user/${name}/comments.json`, { limit, after });

const loadComments = (
  subredditName,
  linkId,
  { depth, limit, sort, comment, threaded }
) =>
  load(`https://reddit.com/r/${subredditName}/comments/${linkId}.json`, {
    depth,
    limit,
    sort,
    comment,
    threaded
  });

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
  loadUserPosts,
  loadUserComments,
  loadRandomSubreddit,
  loadComments
};
