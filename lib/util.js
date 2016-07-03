'use strict';

var lodash = require('lodash');

function findName(url) {
    var regex = /([a-zA-Z0-9_]*)(_s)/;
    var matches = url.match(regex);
    if (matches && matches[1]) {
        return matches[1].replace('_', ' ').toProperCase();
    }
    return "Serial";
}

function findSeason(url) {
    var regex = /_s([0-9])_/;
    var matches = url.match(regex);
    if (matches && matches[1]) {
        return parseInt(matches[1]);
    }
    return "0";
}

function getVideoId(url) {
    //only for gorillavid
    return url.split('/').pop();
}
String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

module.exports = {
    findName: findName,
    findSeason: findSeason,
    getVideoId: getVideoId
};
//# sourceMappingURL=util.js.map