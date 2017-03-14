// MIT © 2017 azu
"use strict";
const getStat = require("./get-stat");
// 最新の投稿を返す
module.exports = function() {
    return getStat().then(stat => {
        const weeks = stat.getJSerWeeks();
        const lastWeek = weeks[weeks.length - 1];
        const post = lastWeek.post;
        return `最新の投稿は「${post.title} ${post.url}」です！`;
    });
};