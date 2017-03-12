// MIT © 2017 azu
"use strict";
const fetch = require("node-fetch");
const toJSON = (response) => {
    return response.then(res => res.json());
};
module.exports = function getStat() {
    const JSerStat = require("jser-stat").JSerStat;
    return Promise.all([
        toJSON(fetch("https://jser.info/posts.json")),
        toJSON(fetch("https://jser.info/source-data/items.json"))
    ]).then(([posts, items]) => {
        return new JSerStat(items, posts);
    });
};