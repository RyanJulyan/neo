/*
 |--------------------------------------------------------------------------
 | Created by   : Ryan Julyan
 | Company      : Acacia Consulting
 | Date			: 1/3/15
 |
 | Last Edited	: Ryan Julyan
 | Date			: 2015/03/18
 |--------------------------------------------------------------------------
 */

var mongoose = require('mongoose'),
	dbConnection = require('./connection'),
	exports = module.exports = {};

// Schema for new returnedTweetsSchema MongoDB Document
var returnedTweetsSchema = new mongoose.Schema({
	user: String,
	campaign: String,
	hashtagsToReplyTo: Array,
	returnedData: mongoose.Schema.Types.Mixed,
	capturedDate: {type: Date, default: Date.now}
});


function upsertNewTweets( data, callback){
	
	// model for new returnedTweets MongoDB Document
	var returnedTweets = mongoose.model('returnedTweets', returnedTweetsSchema);
	
	// Set up Object information to save to MongoDB
	var newTweets = new returnedTweets({
		user: data.user,
		campaign: data.campaign,
		hashtagsToReplyTo: data.hashtagsToReplyTo,
		returnedData: data.returnedData
	});
	
	dbConnection.getConnection(function(dbContext){
		
		newTweets.save(function(err, dbRecord){
            callback(err, dbRecord);
        });
	});

}

exports.upsertNewTweets = upsertNewTweets;

// Schema for new returnedTweetsSchema MongoDB Document
var repliedToTweetSchema = new mongoose.Schema({
	toUser: String,
	userData: mongoose.Schema.Types.Mixed,
	replyTweet: String,
	hashtagRepliedTo: String,
	status_id: String,
	sentDate: {type: Date, default: Date.now}
});


function upsertRepliedToTweet( data, callback){
	
	// model for new repliedToTweet MongoDB Document
	var repliedToTweet = mongoose.model('repliedToTweet', repliedToTweetSchema);
	
	// Set up Object information to save to MongoDB
	var replyTweetData = new repliedToTweet({
		toUser: data.toUser,
		userData: data.userData,
		replyTweet: data.replyTweet,
		hashtagRepliedTo: data.hashtagRepliedTo,
		status_id: data.status_id
	});
	
    var conditions = { status_id: data.status_id };
    var upsertData = replyTweetData.toObject();
	var options = { upsert: true };
	
	dbConnection.getConnection(function(dbContext){
		delete upsertData._id; //Delete the _id property, otherwise Mongo will return a "Mod on _id not allowed" error
		
		repliedToTweet.update(conditions, upsertData, options, function(err, dbRecord){
            callback(err, dbRecord);
        });
	});

}

exports.upsertRepliedToTweet = upsertRepliedToTweet;