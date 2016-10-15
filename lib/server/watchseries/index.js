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

var _winston = require('winston');

var w = _interopRequireWildcard(_winston);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function handleError(res) {
    return function (error) {
        w.error(error.name);
        res.status(500).send(error);
    };
}

function getSerialDetails(req, res) {
    _cache2.default.get('Serial:' + req.params.id, function (response) {
        if (response) {
            w.log('From Cache : Serial:' + req.params.id + ' : ' + response);
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
        var seasons = getSeasons($, req.params.id);
        w.log('To Cache : Serial:' + req.params.id);
        _cache2.default.set('Serial:' + req.params.id, JSON.stringify(seasons));
        res.send(seasons);
    };
}

function getSeasons($, serialId) {
    var seasons = [];
    var season = {};
    $('[itemprop=season]').each(function () {
        var $season = $(this).find('span[itemprop=name]').first().text();
        try {
            season = {
                id: parseInt(/\d+/.exec($season)[0]),
                episodes: []
            };
        } catch (error) {
            w.error('Error in parsing Season id', $season);
        }

        var $episodes = $(this).find('[itemprop="episode"]');
        $episodes.each(function () {
            var episode = {
                name: $(this).find('[itemprop=name]').text().trim()
            };
            try {
                episode.id = /Episode (\d+)/.exec(episode.name)[1];
            } catch (e) {
                w.error('Error in parsing Episode id', episode.name);
                episode.id = Math.random();
            }
            episode.video = _config2.default.watchseries.url + 'episode/' + serialId + '_s' + season.id + '_e' + episode.id + '.html';
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

function getVideoUrl(url) {
    w.log('Getting HTML - ', url);
    return (0, _requestPromise2.default)(url).then(function (response) {
        var $ = _cheerio2.default.load(response);
        try {
            url = $('a[title="gorillavid.in"]').first().attr('href').split('=')[1];

            url = new Buffer(url, 'base64').toString('ascii');
        } catch (e) {
            url = null;
        }
        return url;
    });
}

exports.default = {
    getSerialDetails: getSerialDetails
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndhdGNoc2VyaWVzL2luZGV4LmpzIl0sIm5hbWVzIjpbInciLCJoYW5kbGVFcnJvciIsInJlcyIsImVycm9yIiwibmFtZSIsInN0YXR1cyIsInNlbmQiLCJnZXRTZXJpYWxEZXRhaWxzIiwicmVxIiwiZ2V0IiwicGFyYW1zIiwiaWQiLCJyZXNwb25zZSIsImxvZyIsIkpTT04iLCJwYXJzZSIsInVybCIsIndhdGNoc2VyaWVzIiwidGhlbiIsInByb2Nlc3NIVE1MIiwic2VyaWVzSHRtbCIsIiQiLCJsb2FkIiwic2Vhc29ucyIsImdldFNlYXNvbnMiLCJzZXQiLCJzdHJpbmdpZnkiLCJzZXJpYWxJZCIsInNlYXNvbiIsImVhY2giLCIkc2Vhc29uIiwiZmluZCIsImZpcnN0IiwidGV4dCIsInBhcnNlSW50IiwiZXhlYyIsImVwaXNvZGVzIiwiJGVwaXNvZGVzIiwiZXBpc29kZSIsInRyaW0iLCJlIiwiTWF0aCIsInJhbmRvbSIsInZpZGVvIiwicHVzaCIsInNvcnQiLCJhIiwiYiIsImdldFZpZGVvVXJsIiwiYXR0ciIsInNwbGl0IiwiQnVmZmVyIiwidG9TdHJpbmciXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0lBQVlBLEM7Ozs7OztBQUVaLFNBQVNDLFdBQVQsQ0FBcUJDLEdBQXJCLEVBQTBCO0FBQ3RCLFdBQU8sVUFBU0MsS0FBVCxFQUFnQjtBQUNuQkgsVUFBRUcsS0FBRixDQUFRQSxNQUFNQyxJQUFkO0FBQ0FGLFlBQUlHLE1BQUosQ0FBVyxHQUFYLEVBQWdCQyxJQUFoQixDQUFxQkgsS0FBckI7QUFDSCxLQUhEO0FBSUg7O0FBRUQsU0FBU0ksZ0JBQVQsQ0FBMEJDLEdBQTFCLEVBQStCTixHQUEvQixFQUFvQztBQUNoQyxvQkFDS08sR0FETCxhQUNtQkQsSUFBSUUsTUFBSixDQUFXQyxFQUQ5QixFQUNvQyxVQUFTQyxRQUFULEVBQW1CO0FBQy9DLFlBQUlBLFFBQUosRUFBYztBQUNW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QWFoQixNQUFiO0FBQ0gsS0EzQkQ7QUE0QkFMLFlBQVFzQixJQUFSLENBQWEsVUFBQ0MsQ0FBRCxFQUFJQyxDQUFKO0FBQUEsZUFBVUQsRUFBRW5DLEVBQUYsR0FBT29DLEVBQUVwQyxFQUFuQjtBQUFBLEtBQWI7QUFDQSxXQUFPWSxPQUFQO0FBQ0g7O0FBRUQsU0FBU3lCLFdBQVQsQ0FBcUJoQyxHQUFyQixFQUEwQjtBQUN0QmhCLE1BQUVhLEdBQUYsQ0FBTSxpQkFBTixFQUF5QkcsR0FBekI7QUFDQSxXQUFPLDhCQUFRQSxHQUFSLEVBQWFFLElBQWIsQ0FBa0IsVUFBQ04sUUFBRCxFQUFjO0FBQ25DLFlBQUlTLElBQUksa0JBQVFDLElBQVIsQ0FBYVYsUUFBYixDQUFSO0FBQ0EsWUFBSTtBQUNBSSxrQkFBTUssRUFBRSwwQkFBRixFQUNEVyxLQURDLEdBRURpQixJQUZDLENBRUksTUFGSixFQUdEQyxLQUhDLENBR0ssR0FITCxFQUdVLENBSFYsQ0FBTjs7QUFLQWxDLGtCQUFNLElBQUltQyxNQUFKLENBQVduQyxHQUFYLEVBQWdCLFFBQWhCLEVBQTBCb0MsUUFBMUIsQ0FBbUMsT0FBbkMsQ0FBTjtBQUNILFNBUEQsQ0FPRSxPQUFPWixDQUFQLEVBQVU7QUFDUnhCLGtCQUFNLElBQU47QUFDSDtBQUNELGVBQU9BLEdBQVA7QUFDSCxLQWJNLENBQVA7QUFjSDs7a0JBRWM7QUFDWFQ7QUFEVyxDIiwiZmlsZSI6IndhdGNoc2VyaWVzL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICdiYWJlbC1wb2x5ZmlsbCc7XG5pbXBvcnQgY29uZmlnIGZyb20gJy4uL2NvbmZpZydcbmltcG9ydCByZXF1ZXN0IGZyb20gJ3JlcXVlc3QtcHJvbWlzZSc7XG5pbXBvcnQgY2hlZXJpbyBmcm9tICdjaGVlcmlvJztcbmltcG9ydCBjYWNoZSBmcm9tICcuLi9jYWNoZSc7XG5pbXBvcnQgKiBhcyB3IGZyb20gJ3dpbnN0b24nO1xuXG5mdW5jdGlvbiBoYW5kbGVFcnJvcihyZXMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgdy5lcnJvcihlcnJvci5uYW1lKTtcbiAgICAgICAgcmVzLnN0YXR1cyg1MDApLnNlbmQoZXJyb3IpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0U2VyaWFsRGV0YWlscyhyZXEsIHJlcykge1xuICAgIGNhY2hlXG4gICAgICAgIC5nZXQoYFNlcmlhbDoke3JlcS5wYXJhbXMuaWR9YCwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIHcubG9nKGBGcm9tIENhY2hlIDogU2VyaWFsOiR7cmVxLnBhcmFtcy5pZH0gOiAke3Jlc3BvbnNlfWApO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuc2VuZChKU09OLnBhcnNlKHJlc3BvbnNlKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCB1cmwgPSBgJHtjb25maWcud2F0Y2hzZXJpZXMudXJsfXNlcmllLyR7cmVxLnBhcmFtcy5pZH1gO1xuICAgICAgICAgICAgICAgIHJlcXVlc3QodXJsKS50aGVuKHByb2Nlc3NIVE1MKHJlcSwgcmVzKSwgaGFuZGxlRXJyb3IocmVzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NIVE1MKHJlcSwgcmVzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHNlcmllc0h0bWwpIHtcbiAgICAgICAgbGV0ICQgPSBjaGVlcmlvLmxvYWQoc2VyaWVzSHRtbCk7XG4gICAgICAgIGxldCBzZWFzb25zID0gZ2V0U2Vhc29ucygkLCByZXEucGFyYW1zLmlkKTtcbiAgICAgICAgdy5sb2coYFRvIENhY2hlIDogU2VyaWFsOiR7cmVxLnBhcmFtcy5pZH1gKTtcbiAgICAgICAgY2FjaGUuc2V0KGBTZXJpYWw6JHtyZXEucGFyYW1zLmlkfWAsIEpTT04uc3RyaW5naWZ5KHNlYXNvbnMpKTtcbiAgICAgICAgcmVzLnNlbmQoc2Vhc29ucyk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXRTZWFzb25zKCQsIHNlcmlhbElkKSB7XG4gICAgbGV0IHNlYXNvbnMgPSBbXTtcbiAgICBsZXQgc2Vhc29uID0ge307XG4gICAgJCgnW2l0ZW1wcm9wPXNlYXNvbl0nKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgJHNlYXNvbiA9ICQodGhpcykuZmluZCgnc3BhbltpdGVtcHJvcD1uYW1lXScpLmZpcnN0KCkudGV4dCgpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgc2Vhc29uID0ge1xuICAgICAgICAgICAgICAgIGlkOiBwYXJzZUludCgvXFxkKy8uZXhlYygkc2Vhc29uKVswXSksXG4gICAgICAgICAgICAgICAgZXBpc29kZXM6IFtdXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICB3LmVycm9yKCdFcnJvciBpbiBwYXJzaW5nIFNlYXNvbiBpZCcsICRzZWFzb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0ICRlcGlzb2RlcyA9ICQodGhpcykuZmluZCgnW2l0ZW1wcm9wPVwiZXBpc29kZVwiXScpO1xuICAgICAgICAkZXBpc29kZXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxldCBlcGlzb2RlID0ge1xuICAgICAgICAgICAgICAgIG5hbWU6ICQodGhpcykuZmluZCgnW2l0ZW1wcm9wPW5hbWVdJykudGV4dCgpLnRyaW0oKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBlcGlzb2RlLmlkID0gL0VwaXNvZGUgKFxcZCspLy5leGVjKGVwaXNvZGUubmFtZSlbMV07XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgdy5lcnJvcignRXJyb3IgaW4gcGFyc2luZyBFcGlzb2RlIGlkJywgZXBpc29kZS5uYW1lKTtcbiAgICAgICAgICAgICAgICBlcGlzb2RlLmlkID0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVwaXNvZGUudmlkZW8gPSBgJHtjb25maWcud2F0Y2hzZXJpZXMudXJsfWVwaXNvZGUvJHtzZXJpYWxJZH1fcyR7c2Vhc29uLmlkfV9lJHtlcGlzb2RlLmlkfS5odG1sYFxuICAgICAgICAgICAgc2Vhc29uLmVwaXNvZGVzLnB1c2goZXBpc29kZSk7XG4gICAgICAgIH0pXG4gICAgICAgIHNlYXNvbi5lcGlzb2Rlcy5zb3J0KChhLCBiKSA9PiBhLmlkIC0gYi5pZCk7XG4gICAgICAgIHNlYXNvbnMucHVzaChzZWFzb24pO1xuICAgIH0pXG4gICAgc2Vhc29ucy5zb3J0KChhLCBiKSA9PiBhLmlkIC0gYi5pZCk7XG4gICAgcmV0dXJuIHNlYXNvbnM7XG59XG5cbmZ1bmN0aW9uIGdldFZpZGVvVXJsKHVybCkge1xuICAgIHcubG9nKCdHZXR0aW5nIEhUTUwgLSAnLCB1cmwpO1xuICAgIHJldHVybiByZXF1ZXN0KHVybCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgdmFyICQgPSBjaGVlcmlvLmxvYWQocmVzcG9uc2UpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdXJsID0gJCgnYVt0aXRsZT1cImdvcmlsbGF2aWQuaW5cIl0nKVxuICAgICAgICAgICAgICAgIC5maXJzdCgpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2hyZWYnKVxuICAgICAgICAgICAgICAgIC5zcGxpdCgnPScpWzFdO1xuXG4gICAgICAgICAgICB1cmwgPSBuZXcgQnVmZmVyKHVybCwgJ2Jhc2U2NCcpLnRvU3RyaW5nKCdhc2NpaScpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB1cmwgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1cmw7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBnZXRTZXJpYWxEZXRhaWxzXG59Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
