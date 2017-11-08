const fetch = require("node-fetch");
const Qs = require("qs");

const load = (url, query) => {
  const queryString = query ? `?${Qs.stringify(query)}` : "";

  return fetch(`${url}${queryString}`).then(response => response.json());
};

const loadSubreddit = name => load(`https://reddit.com/r/${name}/about.json`);

const loadSubredditListings = (name, listingsType = "hot") =>
  load(`https://reddit.com/r/${name}/${listingsType}.json`);

module.exports = {
  loadSubreddit,
  loadSubredditListings
};
