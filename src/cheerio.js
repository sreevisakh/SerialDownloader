/* global Buffer,process */

import cheerio from 'cheerio';
import request from 'request';
import _ from 'lodash';
import fs from 'fs';
import q from 'q';
import util from './util';
import Rx from 'rx';




var postOptions = {
    method: 'POST',
    headers: {
        'content-type': 'application/x-www-form-urlencoded',
    },
    form: {
        op: 'download1',
        method_free: 'Free+Download'
    }
};


function findEpisodeRangeInSeason(url, season) {
    var defered = q.defer();
    request(url, function(error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            var count = $('span:contains("Season ' + parseInt(season) + '")').parents('h2').siblings('ul').children('li').length;
            defered.resolve(_.range(1, count, 1));
        } else {
            defered.reject('FindEpisode');
        }
    });
    return defered.promise;
}

exports.getResult = function(req, res) {
    var url = req.params.url,
        season = req.params.season,
        episode = parseInt(req.params.episode);
    var htmlPromises = [];
    var downloadPromises = [];
    var defered = q.defer();

    if(episode){
        url = url.replace('/serie/', '/episode/');
        url = url + '_s' + season + '_e' + episode + '.html';
        var name = util.findName(url) + ' S' + ('0' + util.findSeason(url)).slice(-2) + 'E' + ('0' + episode).slice(-2);
        getHtml(url,name).then(function(gorillaUrl){
            return download(data.value.url, data.value.name);
        }).then(function(){

        });
    }
    findEpisodeRangeInSeason(req.body.url, req.body.season).then(function(range) {
        url = url.replace('/serie/', '/episode/');
        url = url + '_s' + season + '_e${id}.html';
        _.each(range, function(id) {
            var name = util.findName(url) + ' S' + util.findSeason(url) + 'E' + ('0' + id).slice(-2);
            var subUrl = url.replace('${id}', id);
            htmlPromises.push(getHtml(subUrl, name));
        });
        return q.allSettled(htmlPromises);
    }).then(function(gorillaUrls) {
        _.each(gorillaUrls, function(data) {
            if (data.value) {
                var downloadPromise = download(data.value.url, data.value.name);
                downloadPromises.push(downloadPromise);
            }
        });
        return q.allSettled(downloadPromises);
    }).then(function(response) {
        console.log(response);
        response = _.reduce(response, function(result, item) {
            return item ? result + item.value : '';
        }, '')
        res.send(response);
    }, function(error) {
        res.status(500).send(error);
    });
};


function getHtml(url, name) {
    var defered = q.defer();
    console.log('Getting HTML - ', url);
    request(url, function(error, response, html) {
        if (!error && response && response.statusCode == 200) {
            var $ = cheerio.load(html);
            try {
                var url = $('a[title="gorillavid.in"]').first().attr('href').split('=')[1]
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
    var defered = q.defer();
    console.log('Downloading ' + name, url);
    if (!url) {
        defered.reject('Invalid url');
        return defered.promise;
    }

    var options = postOptions;
    options.url = url;
    options.form.id = util.getVideoId(url);

    request(options, function(error, response, body) {
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
