# reddit-graphql-wrapper
This is a work in progress graphql wrapper for the reddit api. Currently this only supports fetching information for a subreddit and the listing of its posts.

# Installation
Clone the repository, create a `.env` file and add `PORT=4000` (or any other port) to the file. Run `npm start` and go to `http://localhost:4000/graphql`

# Example query
Paste this query in your *GraphiQL* box and hit run.

```graphql
query {
  subreddit(name: "pics") {
    name,
    listings {
      hot {
        title,
        url
    	}
    }
  }
}
``` 

# Query documentation
TBD