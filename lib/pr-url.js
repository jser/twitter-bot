// MIT © 2017 azu
"use strict";
const getStat = require("./get-stat");
module.exports = function prURL() {
    return getStat().then(stat => {
        const nextWeekNumber = stat.getTotalWeekCount() + 1;
        return `https://github.com/jser/jser.github.io/pull/jser-week-${nextWeekNumber}`;
    });
};