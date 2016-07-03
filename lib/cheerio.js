'use strict';

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

var _rx = require('rx');

var _rx2 = _interopRequireDefault(_rx);

var _rxNode = require('rx-node');

var _rxNode2 = _interopRequireDefault(_rxNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global Buffer,process */

var postOptions = {
    method: 'POST',
    headers: {
        'content-type': 'application/x-www-form-urlencoded'
    },
    form: {
        op: 'download1',
        method_free: 'Free+Download'
    }
};

function findEpisodeRangeInSeason(url, season) {
    var defered = _q2.default.defer();
    (0, _request2.default)(url, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = _cheerio2.default.load(html);
            var count = $('span:contains("Season ' + parseInt(season) + '")').parents('h2').siblings('ul').children('li').length;
            defered.resolve(_lodash2.default.range(1, count, 1));
        } else {
            defered.reject('FindEpisode');
        }
    });
    return defered.promise;
}

exports.getResult = function (url, season) {
    var htmlPromises = [];
    var downloadPromises = [];
    var defered = _q2.default.defer();
    findEpisodeRangeInSeason(url, season).then(function (range) {
        url = url.replace('/serie/', '/episode/');
        url = url + '_s' + season + '_e${id}.html';
        _lodash2.default.each(range, function (id) {
            var name = _util2.default.findName(url) + " S" + ("0" + _util2.default.findSeason(url)).slice(-2) + "E" + ("0" + id).slice(-2);
            var subUrl = url.replace('${id}', id);
            htmlPromises.push(getHtml(subUrl, name));
        });
        return _q2.default.allSettled(htmlPromises);
    }).then(function (gorillaUrls) {
        _lodash2.default.each(gorillaUrls, function (data) {
            if (data.value) {
                var downloadPromise = download(data.value.url, data.value.name);
                downloadPromises.push(downloadPromise);
            }
        });
        return _q2.default.allSettled(downloadPromises);
    }).then(function (response) {
        response = _lodash2.default.reduce(response, function (result, item) {
            return result + item.value;
        }, '');
        defered.resolve(response);
    }, function (error) {
        defered.reject('GetResult');
    });
    return defered.promise;
};

function getHtml(url, name) {
    var defered = _q2.default.defer();
    console.log('Getting HTML - ', url);
    (0, _request2.default)(url, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = _cheerio2.default.load(html);
            var url = $('a[title="gorillavid.in"]').first().attr('href').split('=')[1];
            url = new Buffer(url, 'base64').toString('ascii');
            defered.resolve({
                url: url,
                name: name
            });
        } else if (response.statusCode == 404) {
            defered.resolve(null);
        } else {
            defered.reject("Get Html");
        }
    });
    return defered.promise;
}

function download(url, name) {
    console.log('Downloading ' + name);
    var options = postOptions;
    options.url = url;
    options.form.id = _util2.default.getVideoId(url);
    var defered = _q2.default.defer();
    (0, _request2.default)(options, function (error, response, body) {
        if (error) {
            defered.reject('Download' + url);
        }
        var pattern = /"http(.*)(\.flv|\.mkv|\.mp4)"/;
        var matches = pattern.exec(body);
        if (matches && matches[0]) {
            defered.resolve('<br><a download="' + name + '" href=' + matches[0] + '>' + name + '</a>');
        } else {
            defered.resolve("");
        }
    });
    return defered.promise;
}
//# sourceMappingURL=cheerio.js.map