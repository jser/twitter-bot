// load .env file
require('dotenv').config();

const path = require('path');
const statusOfPost = require("./lib/status-of-post");
const Twit = require('twit');
const config = {
    /* Be sure to update the .env file with your API keys. See how to get them: https://botwiki.org/tutorials/make-an-image-posting-twitter-bot/#creating-a-twitter-app*/
    twitter: {
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET
    }
};
const T = new Twit(config.twitter);
const stream = T.stream('statuses/filter', { track: '@jser_info' });
const isReply = (tweet) => {
    return /@jser_info/.test(tweet.text);
};
const isStat = (tweet) => {
    return /(stat|status|ステータス)/.test(tweet.text);
};
stream.on('tweet', function(tweet) {
    if (!isReply(tweet)) {
        return;
    }
    const replyTo = `@${tweet.user.screen_name}`;
    if (isStat(tweet)) {
        return statusOfPost().then(text => {
            T.post('statuses/update', {
                status: `${replyTo} ${text}`,
                in_reply_to_status_id: tweet.id
            }, function(error, data, response) {
                if (error) {
                    console.log(error.message, error.stack);
                }
            });
        }).catch(error => {
            console.log(error.message, error.stack);
        });
    }
});


/**********************************************************************************************/
/* The code below takes care of serving the index.html file, no need to change anything here. */

const express = require('express');
const app = express();
app.use(express.static('public'));
const listener = app.listen(process.env.PORT, function() {
    console.log('Your app is listening on port ' + listener.address().port);
});

