'use strict';

var Rx = require('rx');
var RxNode = require('rx-node');
var request = require('request');
var _ = require('lodash');
var cheerio = require('cheerio');

exports.getResult = function (req, res) {
    var result = '';
    fetchContent({
        url: req.body.url
    }, req.body.season).flatMap(getEpisodeRange).map(formEpisodeUrl.bind(null, req.body.url, req.body.season)).flatMap(downloadHtml).map(getGorillaUrl).flatMap(postToGorilla).map(getVideoUrl).flatMap(prepareHtml).subscribe(function (data) {
        result += data;
    }, function (error) {
        res.send(JSON.stringify(error));
    }, function () {
        res.send(result);
    });
};

function fetchContent(params) {
    console.log(params.url);
    var args = [].slice.call(arguments, 1);
    return Rx.Observable.create(function (observer) {
        request(params, function (error, response, body) {
            if (error) {
                observer.onError();
            } else if (response.statusCode === 200) {
                observer.onNext({
                    name: params.name,
                    response: response,
                    body: body,
                    args: args
                });
            } else {

                observer.onError();
            }
            observer.onCompleted();
        });
    });
};

function prepareHtml(_ref) {
    var url = _ref.url;
    var name = _ref.name;

    return '<a href=' + url + '>' + name + '</a><br>';
}

function fileName(url, season, episode) {
    return _.last(url.split('/')).replace('_', ' ').concat(' S' + ('0' + (season + '')).slice(-2) + 'E' + ('0' + (episode + '')).slice(-2));
}

function getVideoUrl(data) {
    var pattern = /"http(.*)(\.flv|\.mkv|\.mp4)"/;
    var matches = pattern.exec(data.body);
    if (matches && matches[0]) {
        return { url: matches[0], name: data.name };
    } else {
        return null;
    }
}

function postToGorilla(_ref2) {
    var url = _ref2.url;
    var name = _ref2.name;

    var params = {
        name: name,
        url: url,
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        form: {
            op: 'download1',
            method_free: 'Free+Download',
            id: _.last(url.split('/'))
        }
    };
    return fetchContent(params);
}

function getGorillaUrl(data) {
    try {
        var $ = cheerio.load(data.body);
        var url = $('a[title="gorillavid.in"]').first().attr('href').split('=')[1];
        return { url: new Buffer(url, 'base64').toString('ascii'), name: data.name };
    } catch (error) {
        return Rx.Observable.just(null);
    }
}

function downloadHtml(_ref3) {
    var url = _ref3.url;
    var name = _ref3.name;

    return fetchContent({
        url: url,
        name: name
    });
}

function formEpisodeUrl(url, season, episode) {
    return { url: url.replace('/serie/', '/episode/').concat('_s' + season + '_e' + episode + '.html'), name: fileName(url, season, episode) };
}

function getEpisodeRange(data) {
    var $ = cheerio.load(data.body);
    return _.range(1, $('span').filter(function () {
        return $(this).text() === 'Season ' + data.args[0];
    }).parents('h2').siblings('ul').children('li').length + 1 || 0, 1);
}
//# sourceMappingURL=cheerio-rx.js.map
