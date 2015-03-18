# automateeq
### automateeq is an automatic twitter crawler, initial intent is to reply to specific tweets automatically

> Warning: This project is in very early conceptual development phase.

automateeq is a background service intended to search through a specific handler and reply to specific hashtags.

There is a minimal input interface that pulls from the ./data/config file. which populates the content dynamically.

## Requirements



- user: is The Handler you wish to find tweets sent to
- campaign: This will be helpful for reporting later
- A Twitter app will need to be created (https://apps.twitter.com/) for the following details:
-- consumer_key: From
-- consumer_secret:
-- access_token_key: 
-- access_token_secret:
- repeatInterval; is the number of minuets to repeat the search ( if too frequent, twitter will block the tweets if this happens too often)
- You can have multiple hashtags and replies, it will loop through them while searching.
-- hashtag: leave out the # sign
-- replyTweet: What you wish to reply to
- Own mongoDB "connectionString" to save data (found: ./data/connection.js)

TODO:

- improve error handeling
- encode the passwords, keys etc
- allow for background processes

## License

MIT
