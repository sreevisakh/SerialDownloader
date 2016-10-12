import 'babel-polyfill';
import config from '../config'
import request from 'request-promise';
import cheerio from 'cheerio';
import cache from '../cache';

function handleError(res) {
    return function(error) {
        console.error(error.name);
        res.status(500).send(error);
    }
}

function getSerialDetails(req, res) {
    cache.get(`Serial:${req.params.id}`, function(response) {
        if (response) {
            console.log(`From Cache : Serial:${req.params.id} : ${response}`);
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
        let seasons = getSeasons($);
        console.log(`To Cache : Serial:${req.params.id}`);
        cache.set(`Serial:${req.params.id}`, JSON.stringify(seasons));
        res.send(seasons);
    }
}

function getSeasons($) {
    let seasons = [];
    let season = {};
    $('[itemprop=season]').each(function() {
        let $season = $(this).find('[itemprop=name]').text();
        season = {
            id: parseInt(/[0-9]+\s/.exec($season).join()),
            episodes: []
        }

        let $episodes = $(this).find('[itemprop="episode"]');
        $episodes.each(function(index) {
            let episode = {
                name: $(this).find('[itemprop=name]').text(),

                url: `${config.watchseries.url}episode/s${season.id}_e${index}.html`
            }
            episode.id = episode.name.split(' ')[1];
            season.episodes.push(episode);
        })
        season.episodes.sort((a, b) => a.id - b.id);
        seasons.push(season);
    })
    seasons.sort((a, b) => a.id - b.id);


    return seasons;
}

export default {
    getSerialDetails
}