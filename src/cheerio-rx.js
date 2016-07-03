var Rx = require('rx');
var RxNode = require('rx-node');
var request = require('request');
var _ = require('lodash');
var cheerio = require('cheerio');

var fetchContent = function(params) {
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
var url = 'http://thewatchseries.to/serie/the_flash_2014_';
season = 1;

var params = {
    url
}
fetchContent(params, 1)
    .flatMap(getEpisodeRange)
    .map(formEpisodeUrl)
    .flatMap(downloadHtml)
    .map(getGorillaUrl)
    .map(postToGorilla)
    .map(getVideoUrl)
    .flatMap(prepareHtml)
    .subscribe();

function prepareHtml(urls) {
    return urls.map(function(url) {
        return '<a href=${url}></a>';
    });
}

function fileName(url, season, episode) {
    return Rx.Observable.just(url.split('/'))
        .last().map(function(name) {
            return name.replace('_', ' ').concat(` S${season}E${episode}`);
        });
}

function getVideoUrl(body) {
    var pattern = /"http(.*)(\.flv|\.mkv|\.mp4)"/;
    var matches = pattern.exec(body);
    if (matches && matches[0]) {
        return matches[0]
    } else {
        return null;
    }
}

function postToGorilla(url) {
    var params = {
        url,
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
        },
        form: {
            op: 'download1',
            method_free: 'Free+Download'
        }
    }
    return fetchContent(params)
}

function getGorillaUrl(data) {
    var $ = cheerio.load(data.body);
    var url = $('a[title="gorillavid.in"]').first().attr('href').split('=')[1]
    return url = new Buffer(url, 'base64').toString('ascii');
}

function downloadHtml(url) {
    return fetchContent({
        url
    });
}

function formEpisodeUrl(episode) {
    return url.replace('/serie/', '/episode/').concat(`_s${season}_e${episode}.html`);
}

function getEpisodeRange(data) {
    var $ = cheerio.load(data.body);
    return _.range(1, ($('span').filter(function() {
        return $(this).text() === `Season ${data.args[0]}`;
    }).parents('h2').siblings('ul').children('li').length) + 1 || 0, 1);
}