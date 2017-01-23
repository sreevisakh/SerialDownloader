var Rx = require('rx');
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
                    name: params.name,
                    response,
                    body,
                    args
                });
            }
            observer.onCompleted();
        })
    });
};

function prepareHtml({ url, name }) {
    return `<a href=${url}>${name}</a><br>`;
}

function fileName(url, season, episode) {
    return _.last(url.split('/')).replace('_', ' ').concat(' S' + ('0' + (season + '')).slice(-2) + 'E' + ('0' + (episode + '')).slice(-2))
}

function getVideoUrl(data) {
    var pattern = /"http(.*)(\.flv|\.mkv|\.mp4)"/;
    var matches = pattern.exec(data.body);
    if (matches && matches[0]) {
        return { url: matches[0], name: data.name }
    } else {
        return null;
    }
}

function postToGorilla({ url, name }) {
    var params = {
        name: name,
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
        return { url: new Buffer(url, 'base64').toString('ascii'), name: data.name };
    } catch (error) {
        return Rx.Observable.just(null);
    }
}

function downloadHtml({ url, name }) {
    return fetchContent({
        url,
        name
    });
}

function formEpisodeUrl(url, season, episode) {
    return { url: url.replace('/serie/', '/episode/').concat(`_s${season}_e${episode}.html`), name: fileName(url, season, episode) };
}

function getEpisodeRange(data) {
    var $ = cheerio.load(data.body);
    return _.range(1, ($('span').filter(function() {
        return $(this).text() === `Season ${data.args[0]}`;
    }).parents('h2').siblings('ul').children('li').length) + 2 || 0, 1);
}
