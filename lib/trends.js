// MIT © 2017 azu
"use strict";
const moment = require("moment");
const querystring = require('querystring');
const getStat = require("./get-stat");
// https://jser.info/trends/#beginDate=2016-07-02&endDate=2017-07-183&keywords=React&keywords=Angular
// e.g. "@jser_info angularとreactのトレンド".match(/\s(.+)の(?:トレンド|trend)/i)
module.exports = function trendsURL(text) {
    const keywordMatch = text.match(/^@jser_info\s+(.+)(?:の|を比較した)(?:トレンド|trend)/i);
    if (!keywordMatch) {
        return;
    }
    const keywordList = keywordMatch[1];
    const keywords = keywordList.split(/[と、,]/);
    const beginDate = moment().subtract(1, "year").format("YYYY-MM-DD");
    const endDate = moment().format("YYYY-MM-DD");
    const query = querystring.stringify({ beginDate: beginDate, endDate: endDate, keywords: keywords });
    const trendURL = `https://jser.info/trends/#${query}`;
    return `${keywords.join("と")}のトレンドです！
${trendURL}`;
};