const getStat = require("./get-stat");
/**
 * 平均を求める
 * @param data
 * @returns {number}
 */
function average(data) {
    let sum = 0;
    for (var i = 0; i < data.length; i++) {
        sum = sum + data[i];
    }
    return (sum / data.length);
}
/**
 * 中央値を求める
 * @param arr
 * @returns {*}
 */
function median(arr) {
    var half = (arr.length / 2) | 0;
    var temp = arr.sort();

    if (temp.length % 2) {
        return temp[half];
    }

    return (temp[half - 1] + temp[half]) / 2;
}
function calcData(stat) {
    const jSerWeeks = stat.getJSerWeeks();
    const latestWeek = jSerWeeks[jSerWeeks.length - 1];
    const now = new Date();
    const endDate = latestWeek.endDate;
    const unpublishedItems = stat.findItemsBetween(endDate, now);
    const itemCountList = jSerWeeks.map(function(week) {
        return week.items.length;
    });
    return {
        average: average(itemCountList),
        median: median(itemCountList),
        current: unpublishedItems.length
    };
}

module.exports = function() {
    return getStat().then(stat => {
        const results = calcData(stat);
        return `今の投稿ステータスです！
平均値: ${results.average}
中央値: + ${results.median}
現在値: + ${results.current}`;
    });
};
