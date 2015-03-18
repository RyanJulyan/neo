/*
 |--------------------------------------------------------------------------
 | Created by   : i7macbookpro
 | Company      : Unknown
 | Date			: 1/3/15
 |
 | Last Edited	: Ryan Julyan
 | Date			: 2015/03/17
 |--------------------------------------------------------------------------
 */

var mongoose = require('mongoose'),
	connectionInstance,
	connectionString = 'mongodb://localhost/twitter-saveTweets-001';

// Connect to MongoDB
mongoose.connect(connectionString, function(err){
	if(err){
		console.log(err);
	}
	else{
		console.log("connected to Mongo");
	}
});

// Use only singular instances of connections, reconnect if needed
module.exports = {
    getConnection: function(callback) {
        if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
            callback(connectionInstance);
            return;
        }

        //connect to DB
        mongoose.connect(connectionString);
        mongoose.connection.on('connected', function(databaseConnection) {
            connectionInstance = databaseConnection;
            callback(databaseConnection);
        });

        // If the connection throws an error
        mongoose.connection.on('error',function (err) {
          console.log('Mongoose default connection error: ' + err);
        });

        // When the connection is disconnected
        mongoose.connection.on('disconnected', function () {
          console.log('Mongoose default connection disconnected');
        });

    },
    closeConnectionDueToNodeProcess: function(){
        mongoose.connection.close(function () {
    	    console.log('Mongoose default connection disconnected through app termination');
    	    process.exit(0);
    	  });
    },
    closeConnection:function(){
        mongoose.connection.close(function () {
            console.log('Mongoose connection has been closed!');
        });
    }
}