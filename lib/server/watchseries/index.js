'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('babel-polyfill');

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _cache = require('../cache');

var _cache2 = _interopRequireDefault(_cache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function handleError(res) {
    return function (error) {
        console.error(error.name);
        res.status(500).send(error);
    };
}

function getSerialDetails(req, res) {
    _cache2.default.get('Serial:' + req.params.id, function (response) {
        if (response) {
            console.log('From Cache : Serial:' + req.params.id + ' : ' + response);
            return res.status(200).send(JSON.parse(response));
        } else {
            var url = _config2.default.watchseries.url + 'serie/' + req.params.id;
            (0, _requestPromise2.default)(url).then(processHTML(req, res), handleError(res));
        }
    });
}

function processHTML(req, res) {
    return function (seriesHtml) {
        var $ = _cheerio2.default.load(seriesHtml);
        var seasons = getSeasons($);
        console.log('To Cache : Serial:' + req.params.id);
        _cache2.default.set('Serial:' + req.params.id, JSON.stringify(seasons));
        res.send(seasons);
    };
}

function getSeasons($) {
    var seasons = [];
    var season = {};
    $('[itemprop=season]').each(function () {
        var $season = $(this).find('[itemprop=name]').text();
        season = {
            id: parseInt(/[0-9]+\s/.exec($season).join()),
            episodes: []
        };

        var $episodes = $(this).find('[itemprop="episode"]');
        $episodes.each(function (index) {
            var episode = {
                name: $(this).find('[itemprop=name]').text(),

                url: _config2.default.watchseries.url + 'episode/s' + season.id + '_e' + index + '.html'
            };
            episode.id = episode.name.split(' ')[1];
            season.episodes.push(episode);
        });
        season.episodes.sort(function (a, b) {
            return a.id - b.id;
        });
        seasons.push(season);
    });
    seasons.sort(function (a, b) {
        return a.id - b.id;
    });

    return seasons;
}

exports.default = {
    getSerialDetails: getSerialDetails
};
//# sourceMappingURL=index.js.map
