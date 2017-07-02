// load .env file
const path = require('path');
const statusOfPost = require("./lib/status-of-post");
const latestPost = require("./lib/latest-post");
const getPrURL = require("./lib/pr-url");
const trends = require("./lib/trends");
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
    if (tweet.user.screen_name !== "azu_re") {
        return false;
    }
    return /^@jser_info/.test(tweet.text);
};
const isStat = (tweet) => {
    return /(stat|status|進捗|ステータス)/.test(tweet.text);
};
const isLatest = (tweet) => {
    return /(最新の投稿|新しい投稿|最新の記事|新しい記事)/.test(tweet.text);
};
const isPR_URL = (tweet) => {
    return /(PR|Pull Request|プルリクエスト)/i.test(tweet.text);
};
const isTrend = (tweet) => {
    return /(トレンド|trend)/i.test(tweet.text);
};
const replyTo = (tweet, messsage) => {
    return new Promise((resolve, reject) => {
        const replyTo = `@${tweet.user.screen_name}`;
        T.post('statuses/update', {
            status: `${replyTo} ${messsage}`,
            in_reply_to_status_id: tweet.id
        }, function(error, data, response) {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
};
stream.on('tweet', function(tweet) {
    if (!isReply(tweet)) {
        return;
    }
    if (isStat(tweet)) {
        return statusOfPost().then(text => {
            return replyTo(tweet, text);
        }).catch(error => {
            console.log(error.message, error.stack);
        });
    } else if (isLatest(tweet)) {
        return latestPost().then(text => {
            return replyTo(tweet, text);
        }).catch(error => {
            console.log(error.message, error.stack);
        });
    } else if (isPR_URL(tweet)) {
        return getPrURL().then(text => {
            return replyTo(tweet, text);
        }).catch(error => {
            console.log(error.message, error.stack);
        });
    } else if (isTrend(tweet)) {
        const result = trends(tweet.text);
        if (result) {
            return replyTo(tweet, result);
        }
    }
});


/**********************************************************************************************/
/* The code below takes care of serving the index.html file, no need to change anything here. */

const express = require('express');
const app = express();
app.use(express.static('public'));
const listener = app.listen(process.env.PORT || 0, function() {
    console.log('Your app is listening on port ' + listener.address().port);
});

