/*
 |--------------------------------------------------------------------------
 | Created by   : Ryan Julyan
 | Company      : Acacia Consulting
 | Date			: 2015/03/16
 |
 | Last Edited	: Ryan Julyan
 | Date			: 2015/03/18
 |--------------------------------------------------------------------------
 */
var Twitter = require('twitter'),
	db = require('./data/db'),
	fs = require('fs'),
    sinceId = "0",
	express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	port = 8888;

// Default Config File for Twitter Replies, User needs to have own APP.
var config = require('./data/config.json');
// Set Up Server
server.listen(port);

// Route the index file to server
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
	console.log("Server started on port " + port);
});

// Check Connections for Socket
io.sockets.on('connection', function(socket){
	// Console User Connected socket id
	console.log("User " + socket.id + " Just Connected");
	
	// Send Config to front end.
	socket.emit('load config', config);
	
	socket.on('save config', function(data,callback){
		console.log('save config data');
		console.log(data);
		data = JSON.stringify(data);
		writeTwitterConfig(data)
        callback("data Saved");
	});
	
});

// Read and assign the config file
function readTwitterConfig(){
	fs.readFile('./data/config.json', 'utf8', function (err,data) {
	  if (err) {
		return console.log(err);
	  }
	  config = JSON.parse(data);
	  console.log(config);
	});
}

// Save the Config file and Read the new config file
function writeTwitterConfig(configObj){
	fs.writeFile('./data/config.json', configObj, function(err) {
		if(err) {
			return console.log(err);
		}
		readTwitterConfig();
		console.log("The file was saved!");
	}); 
}

// Using Config Load the APP settings into Twitter Module.
var client = new Twitter({
	consumer_key: config.consumer_key,
	consumer_secret: config.consumer_secret,
	access_token_key: config.access_token_key,
	access_token_secret: config.access_token_secret
});

// Make Call for Tweets, and look for specific hashtags
function getByHashtag(searchUserHandler, hashtagToSearchFor, numberOfRequestedTweets){
	// Create date object for tweet
	var d = new Date();
	
  // Create hashtagsToSearchFor Array used for searching through the Tweets - Used indexOf() to find data, Then referred to object model for reply tweet.
  var hashtagsToSearchFor = [];

  // Loop Through Hashtag Data from Config and assign the Hashtags to the hashtagsToSearchFor Array.
  for(check in config.hashtagsToReplyTo){
    hashtagsToSearchFor.push(config.hashtagsToReplyTo[check].hashtag)
  }

  console.log("------hashtagsToSearchFor------");
  console.log(hashtagsToSearchFor);
  console.log("-------------sinceId-------------");
  console.log(sinceId);
	client.get('search/tweets.json', {since_id: sinceId, q: 'to:'+searchUserHandler, count: numberOfRequestedTweets}, function(err, tweets, response){
		if(err){
			console.log(err);
		}
		else if(tweets){ // If tweets returned.
      sinceId = tweets.search_metadata.max_id_str;
      
      var newTweets = {};
			
			newTweets = {
				user: config.user,
				campaign: config.campaign,
				hashtagsToReplyTo: hashtagsToSearchFor,
				returnedData: tweets
			};
			
			db.upsertNewTweets(newTweets, function(err, dbData){
				if(err){
					console.log(err);
				}
				else{
          
					// Loop Through tweets
					for(tweet in tweets.statuses){
						// Check if tweet has hashtag
						if(tweets.statuses[tweet].entities.hashtags.length > 0){
							// Loop Through that tweet hashtags
							for(hashtag in tweets.statuses[tweet].entities.hashtags){
								// Check if hashtag matches any of the hashtagsToSearchFor Array object
								if(hashtagsToSearchFor.indexOf(tweets.statuses[tweet].entities.hashtags[hashtag].text) != -1){
									// Assign the array index of the matching object to use as reference to the config object to get the correct reply
									var replyIndex = hashtagsToSearchFor.indexOf(tweets.statuses[tweet].entities.hashtags[hashtag].text);
									// Assign values for the reply function
									
									var user = "@"+tweets.statuses[tweet].user.screen_name,
										userData = tweets.statuses[tweet].user,
										hour = d.getHours(),
										min = d.getMinutes(),
										Date = d.getDate(),
										// use the array index of the matching object to get the correct reply
										replyTweet = user + " " + config.hashtagsToReplyTo[replyIndex].replyTweet; // + " " + Date + " " + hour + ":" + min; // User Must be included in tweet or the reply will not be activated
										status_id = tweets.statuses[tweet].id_str, // id_str worked, id did not
										foundHashtag = tweets.statuses[tweet].entities.hashtags[hashtag].text;
									
									console.log("user: " + user);
									console.log("reply: " + replyTweet);
									console.log("in_reply_to_status_id: " + status_id);
									console.log("foundHashtag: " + foundHashtag);
									
									// Run the reply function with specific details.
									replyToTweet(user, userData, replyTweet, foundHashtag, status_id);
								}
							}
						}
					}
				}
			});
			
			
		}
		else{
			console.log("No Tweets Found For:");
			console.log(hashtagsToSearchFor);
		}
	});
}

function replyToTweet(user, userData, replyTweet, foundHashtag, status_id){
	client.post('statuses/update', {status: replyTweet, in_reply_to_status_id:status_id}, function(err, tweet, response){
	  if (!err) {
		var replyTweetData = {};
			
		replyTweetData = {
			toUser: user,
			userData: userData,
			replyTweet: replyTweet,
			hashtagRepliedTo: foundHashtag,
			status_id: status_id
		};
		
		db.upsertRepliedToTweet(replyTweetData, function(err, dbData){
			console.log("------- You Replied: -------");
			console.log(tweet.text);
		});
	  }
	  else{
		console.log(err);
	  }
	});
}

// Do not allow memory leaks for setInterval
function init(refreshTime){
	// Convert interval into milliseconds and then into minutes
	refreshTime = (refreshTime * 1000)*60;
    ref = setInterval(function() { searchTwitter(); }, refreshTime);
}
// Looped Function
function searchTwitter(){
	var d = new Date();
	console.log('searchTwitter @ ' +d);
	// Run the twitter hashtag checker and replier
	getByHashtag(config.user, config.hashtagToSearchFor, config.numberOfRequestedTweets);
    // Clear the previous Interval to prevent memory leaks for setInterval
	clearInterval(ref);
    init(config.repeatInterval);
}
// Run the loop
init(); // don't pass the parameters, so it runs first time