import 'babel-polyfill';
import config from '../config'
import request from 'request-promise';
import cheerio from 'cheerio';
import cache from '../cache';
import * as w from 'winston';

function handleError(res) {
    return function(error) {
        w.error(error.name);
        res.status(500).send(error);
    }
}

function getSerialDetails(req, res) {
    cache
        .get(`Serial:${req.params.id}`, function(response) {
            if (response) {
                w.log(`From Cache : Serial:${req.params.id} : ${response}`);
                return res.status(200).send(JSON.parse(response));
            } else {
                let url = `${config.watchseries.url}serie/${req.params.id}`;
                request(url).then(processHTML(req, res), handleError(res));
            }
        })
}

function processHTML(req, res) {
    return function(seriesHtml) {
        let $ = cheerio.load(seriesHtml);
        let seasons = getSeasons($, req.params.id);
        w.log(`To Cache : Serial:${req.params.id}`);
        cache.set(`Serial:${req.params.id}`, JSON.stringify(seasons));
        res.send(seasons);
    }
}

function getSeasons($, serialId) {
    let seasons = [];
    let season = {};
    $('[itemprop=season]').each(function() {
        let $season = $(this).find('span[itemprop=name]').first().text();
        try {
            season = {
                id: parseInt(/\d+/.exec($season)[0]),
                episodes: []
            }
        } catch (error) {
            w.error('Error in parsing Season id', $season);
        }

        let $episodes = $(this).find('[itemprop="episode"]');
        $episodes.each(function() {
            let episode = {
                name: $(this).find('[itemprop=name]').text().trim()
            }
            try {
                episode.id = /Episode (\d+)/.exec(episode.name)[1];
            } catch (e) {
                w.error('Error in parsing Episode id', episode.name);
                episode.id = Math.random();
            }
            episode.video = `${config.watchseries.url}episode/${serialId}_s${season.id}_e${episode.id}.html`
            season.episodes.push(episode);
        })
        season.episodes.sort((a, b) => a.id - b.id);
        seasons.push(season);
    })
    seasons.sort((a, b) => a.id - b.id);
    return seasons;
}

function getVideoUrl(url) {
    w.log('Getting HTML - ', url);
    return request(url).then((response) => {
        var $ = cheerio.load(response);
        try {
            url = $('a[title="gorillavid.in"]')
                .first()
                .attr('href')
                .split('=')[1];

            url = new Buffer(url, 'base64').toString('ascii');
        } catch (e) {
            url = null;
        }
        return url;
    });
}

export default {
    getSerialDetails
}