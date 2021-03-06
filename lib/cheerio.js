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

exports.getResult = function (req, res) {
    var url = req.body.url,
        season = req.body.season;
    var htmlPromises = [];
    var downloadPromises = [];
    var defered = _q2.default.defer();
    findEpisodeRangeInSeason(req.body.url, req.body.season).then(function (range) {
        url = url.replace('/serie/', '/episode/');
        url = url + '_s' + season + '_e${id}.html';
        _lodash2.default.each(range, function (id) {
            var name = _util2.default.findName(url) + ' S' + ('0' + _util2.default.findSeason(url)).slice(-2) + 'E' + ('0' + id).slice(-2);
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
        console.log(response);
        response = _lodash2.default.reduce(response, function (result, item) {
            return item ? result + item.value : '';
        }, '');
        res.send(response);
    }, function (error) {
        res.status(500).send(error);
    });
};

function getHtml(url, name) {
    var defered = _q2.default.defer();
    console.log('Getting HTML - ', url);
    (0, _request2.default)(url, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = _cheerio2.default.load(html);
            try {
                var url = $('a[title="gorillavid.in"]').first().attr('href').split('=')[1];
                url = new Buffer(url, 'base64').toString('ascii');
            } catch (e) {
                url = null;
            }
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
    var defered = _q2.default.defer();
    console.log('Downloading ' + name, url);
    if (!url) {
        defered.reject('Invalid url');
        return defered.promise;
    }

    var options = postOptions;
    options.url = url;
    options.form.id = _util2.default.getVideoId(url);

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