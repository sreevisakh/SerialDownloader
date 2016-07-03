var Rx = require('rx');
var RxNode = require('rx-node');
var request = require('request');
var _ = require('lodash');
var cheerio = require('cheerio');

exports.getResult = function(req, res) {
    var result = '';
    fetchContent({
            url: req.body.url
        }, req.body.season)
        .flatMap(getEpisodeRange)
        .map(formEpisodeUrl.bind(null, req.body.url, req.body.season))
        .flatMap(downloadHtml)
        .map(getGorillaUrl)
        .flatMap(postToGorilla)
        .map(getVideoUrl)
        .flatMap(prepareHtml)
        .subscribe(function(data) {
            result += data;
        }, function(error) {
            res.send(JSON.stringify(error))
        }, function() {
            res.send(result);
        });
}


function fetchContent(params) {
    console.log(params.url);
    var args = [].slice.call(arguments, 1)
    return Rx.Observable.create(function(observer) {
        request(params, function(error, response, body) {
            if (error) {
                observer.onError();
            } else {
                observer.onNext({
                    response: response,
                    body: body,
                    args: args
                });
            }
            observer.onCompleted();
        })
    });
};

function prepareHtml(url) {
    return `<a href=${url}></a>`;
}

function fileName(url, season, episode) {
    return Rx.Observable.just(url.split('/'))
        .last().map(function(name) {
            return name.replace('_', ' ').concat(` S${season}E${episode}`);
        });
}

function getVideoUrl(data) {
    var pattern = /"http(.*)(\.flv|\.mkv|\.mp4)"/;
    var matches = pattern.exec(data.body);
    if (matches && matches[0]) {
        return matches[0]
    } else {
        return null;
    }
}

function postToGorilla(url) {
    var params = {
        url: url,
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
        },
        form: {
            op: 'download1',
            method_free: 'Free+Download',
            id: _.last(url.split('/')),
        }
    }
    return fetchContent(params)
}

function getGorillaUrl(data) {
    try {
        var $ = cheerio.load(data.body);
        var url = $('a[title="gorillavid.in"]').first().attr('href').split('=')[1]
        return url = new Buffer(url, 'base64').toString('ascii');
    } catch (error) {
        return Rx.Observable.just(null);
    }
}

function downloadHtml(url) {
    return fetchContent({
        url
    });
}

function formEpisodeUrl(url, season, episode) {
    return url.replace('/serie/', '/episode/').concat(`_s${season}_e${episode}.html`);
}

function getEpisodeRange(data) {
    var $ = cheerio.load(data.body);
    return _.range(1, ($('span').filter(function() {
        return $(this).text() === `Season ${data.args[0]}`;
    }).parents('h2').siblings('ul').children('li').length) + 1 || 0, 1);
}