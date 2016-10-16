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

var _util = require('../util');

var _util2 = _interopRequireDefault(_util);

require('request-debug');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function handleError(res) {
    return function (error) {
        w.error(error.name);
        res.status(500).send(error);
    };
}

function getSerialDetails(req, res) {
    _cache2.default.get('Serial:' + req.params.id).then(function (response) {
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
            return b.id - a.id;
        });
        seasons.push(season);
    });
    seasons.sort(function (a, b) {
        return a.id - b.id;
    });
    return seasons;
}

function getVideoUrl(req, res) {
    var data, response, fetchUrl;
    return regeneratorRuntime.async(function getVideoUrl$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    fetchUrl = function fetchUrl() {
                        return regeneratorRuntime.async(function fetchUrl$(_context) {
                            while (1) {
                                switch (_context.prev = _context.next) {
                                    case 0:
                                        console.log('Getting HTML - ', req.body.url);
                                        return _context.abrupt('return', new Promise(function (resolve, reject) {
                                            (0, _requestPromise2.default)(req.body.url).then(function (response) {
                                                var $ = _cheerio2.default.load(response);
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
                                                var options = postOptions;
                                                var url = void 0;
                                                try {
                                                    url = $('a[title="gorillavid.in"]').first().attr('href').split('=')[1];
                                                    url = new Buffer(url, 'base64').toString('ascii');
                                                    options.url = url;
                                                    options.form.id = _util2.default.getVideoId(url);
                                                    return (0, _requestPromise2.default)(options);
                                                } catch (error) {
                                                    return new Promise.reject(error);
                                                }
                                            }).then(function (body) {

                                                var pattern = /"http(.*)(\.flv|\.mkv|\.mp4)"/;
                                                var matches = pattern.exec(body);
                                                if (matches && matches[0]) {
                                                    resolve({ url: matches[0] });
                                                } else {
                                                    reject();
                                                }
                                            }, function (error) {
                                                reject(error);
                                            });
                                        }));

                                    case 2:
                                    case 'end':
                                        return _context.stop();
                                }
                            }
                        }, null, this);
                    };

                    _context2.prev = 1;
                    _context2.next = 4;
                    return regeneratorRuntime.awrap(_cache2.default.get(req.body.url));

                case 4:
                    data = _context2.sent;

                    if (!(data && req.headers['cache-control'] !== 'no-cache')) {
                        _context2.next = 7;
                        break;
                    }

                    return _context2.abrupt('return', res.send(JSON.parse(data)));

                case 7:
                    _context2.next = 9;
                    return regeneratorRuntime.awrap(fetchUrl());

                case 9:
                    response = _context2.sent;

                    _cache2.default.set(req.body.url, JSON.stringify(response));
                    return _context2.abrupt('return', res.send(response));

                case 14:
                    _context2.prev = 14;
                    _context2.t0 = _context2['catch'](1);
                    return _context2.abrupt('return', res.status(500).send(_context2.t0));

                case 17:
                case 'end':
                    return _context2.stop();
            }
        }
    }, null, this, [[1, 14]]);
}

var _default = {
    getSerialDetails: getSerialDetails,
    getVideoUrl: getVideoUrl
};
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(handleError, 'handleError', '/home/sv/projects/utils/SerialKiller/src/server/watchseries/index.js');

    __REACT_HOT_LOADER__.register(getSerialDetails, 'getSerialDetails', '/home/sv/projects/utils/SerialKiller/src/server/watchseries/index.js');

    __REACT_HOT_LOADER__.register(processHTML, 'processHTML', '/home/sv/projects/utils/SerialKiller/src/server/watchseries/index.js');

    __REACT_HOT_LOADER__.register(getSeasons, 'getSeasons', '/home/sv/projects/utils/SerialKiller/src/server/watchseries/index.js');

    __REACT_HOT_LOADER__.register(getVideoUrl, 'getVideoUrl', '/home/sv/projects/utils/SerialKiller/src/server/watchseries/index.js');

    __REACT_HOT_LOADER__.register(_default, 'default', '/home/sv/projects/utils/SerialKiller/src/server/watchseries/index.js');
}();

;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndhdGNoc2VyaWVzL2luZGV4LmpzIl0sIm5hbWVzIjpbInciLCJoYW5kbGVFcnJvciIsInJlcyIsImVycm9yIiwibmFtZSIsInN0YXR1cyIsInNlbmQiLCJnZXRTZXJpYWxEZXRhaWxzIiwicmVxIiwiZ2V0IiwicGFyYW1zIiwiaWQiLCJ0aGVuIiwicmVzcG9uc2UiLCJsb2ciLCJKU09OIiwicGFyc2UiLCJ1cmwiLCJ3YXRjaHNlcmllcyIsInByb2Nlc3NIVE1MIiwic2VyaWVzSHRtbCIsIiQiLCJsb2FkIiwic2Vhc29ucyIsImdldFNlYXNvbnMiLCJzZXQiLCJzdHJpbmdpZnkiLCJzZXJpYWxJZCIsInNlYXNvbiIsImVhY2giLCIkc2Vhc29uIiwiZmluZCIsImZpcnN0IiwidGV4dCIsInBhcnNlSW50IiwiZXhlYyIsImVwaXNvZGVzIiwiJGVwaXNvZGVzIiwiZXBpc29kZSIsInRyaW0iLCJlIiwiTWF0aCIsInJhbmRvbSIsInZpZGVvIiwicHVzaCIsInNvcnQiLCJhIiwiYiIsImdldFZpZGVvVXJsIiwiZmV0Y2hVcmwiLCJjb25zb2xlIiwiYm9keSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwicG9zdE9wdGlvbnMiLCJtZXRob2QiLCJoZWFkZXJzIiwiZm9ybSIsIm9wIiwibWV0aG9kX2ZyZWUiLCJvcHRpb25zIiwiYXR0ciIsInNwbGl0IiwiQnVmZmVyIiwidG9TdHJpbmciLCJnZXRWaWRlb0lkIiwicGF0dGVybiIsIm1hdGNoZXMiLCJkYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztJQUFZQSxDOztBQUNaOzs7O0FBQ0E7Ozs7OztBQUVBLFNBQVNDLFdBQVQsQ0FBcUJDLEdBQXJCLEVBQTBCO0FBQ3RCLFdBQU8sVUFBU0MsS0FBVCxFQUFnQjtBQUNuQkgsVUFBRUcsS0FBRixDQUFRQSxNQUFNQyxJQUFkO0FBQ0FGLFlBQUlHLE1BQUosQ0FBVyxHQUFYLEVBQWdCQyxJ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LENBQVNTLEtBQUtDLEtBQUwsQ0FBV3FELElBQVgsQ0FBVCxDQUpuQjs7QUFBQTtBQUFBO0FBQUEsb0RBTTZCcEIsVUFON0I7O0FBQUE7QUFNWXBDLDRCQU5aOztBQU9RLG9DQUFNWSxHQUFOLENBQVVqQixJQUFJMkMsSUFBSixDQUFTbEMsR0FBbkIsRUFBd0JGLEtBQUtXLFNBQUwsQ0FBZWIsUUFBZixDQUF4QjtBQVBSLHNEQVFlWCxJQUFJSSxJQUFKLENBQVNPLFFBQVQsQ0FSZjs7QUFBQTtBQUFBO0FBQUE7QUFBQSxzREFVZVgsSUFBSUcsTUFBSixDQUFXLEdBQVgsRUFBZ0JDLElBQWhCLGNBVmY7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O2VBeURlO0FBQ1hDLHNDQURXO0FBRVh5QztBQUZXLEM7Ozs7Ozs7OztrQ0F6SE4vQyxXOztrQ0FPQU0sZ0I7O2tDQVlBWSxXOztrQ0FVQUssVTs7a0NBbUNNd0IsVyIsImZpbGUiOiJ3YXRjaHNlcmllcy9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnYmFiZWwtcG9seWZpbGwnO1xuaW1wb3J0IGNvbmZpZyBmcm9tICcuLi9jb25maWcnXG5pbXBvcnQgcmVxdWVzdCBmcm9tICdyZXF1ZXN0LXByb21pc2UnO1xuaW1wb3J0IGNoZWVyaW8gZnJvbSAnY2hlZXJpbyc7XG5pbXBvcnQgY2FjaGUgZnJvbSAnLi4vY2FjaGUnO1xuaW1wb3J0ICogYXMgdyBmcm9tICd3aW5zdG9uJztcbmltcG9ydCB1dGlsIGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0ICdyZXF1ZXN0LWRlYnVnJztcblxuZnVuY3Rpb24gaGFuZGxlRXJyb3IocmVzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIHcuZXJyb3IoZXJyb3IubmFtZSk7XG4gICAgICAgIHJlcy5zdGF0dXMoNTAwKS5zZW5kKGVycm9yKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGdldFNlcmlhbERldGFpbHMocmVxLCByZXMpIHtcbiAgICBjYWNoZS5nZXQoYFNlcmlhbDoke3JlcS5wYXJhbXMuaWR9YCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHcubG9nKGBGcm9tIENhY2hlIDogU2VyaWFsOiR7cmVxLnBhcmFtcy5pZH0gOiAke3Jlc3BvbnNlfWApO1xuICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKEpTT04ucGFyc2UocmVzcG9uc2UpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCB1cmwgPSBgJHtjb25maWcud2F0Y2hzZXJpZXMudXJsfXNlcmllLyR7cmVxLnBhcmFtcy5pZH1gO1xuICAgICAgICAgICAgcmVxdWVzdCh1cmwpLnRoZW4ocHJvY2Vzc0hUTUwocmVxLCByZXMpLCBoYW5kbGVFcnJvcihyZXMpKTtcbiAgICAgICAgfVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NIVE1MKHJlcSwgcmVzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHNlcmllc0h0bWwpIHtcbiAgICAgICAgbGV0ICQgPSBjaGVlcmlvLmxvYWQoc2VyaWVzSHRtbCk7XG4gICAgICAgIGxldCBzZWFzb25zID0gZ2V0U2Vhc29ucygkLCByZXEucGFyYW1zLmlkKTtcbiAgICAgICAgdy5sb2coYFRvIENhY2hlIDogU2VyaWFsOiR7cmVxLnBhcmFtcy5pZH1gKTtcbiAgICAgICAgY2FjaGUuc2V0KGBTZXJpYWw6JHtyZXEucGFyYW1zLmlkfWAsIEpTT04uc3RyaW5naWZ5KHNlYXNvbnMpKTtcbiAgICAgICAgcmVzLnNlbmQoc2Vhc29ucyk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXRTZWFzb25zKCQsIHNlcmlhbElkKSB7XG4gICAgbGV0IHNlYXNvbnMgPSBbXTtcbiAgICBsZXQgc2Vhc29uID0ge307XG4gICAgJCgnW2l0ZW1wcm9wPXNlYXNvbl0nKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgJHNlYXNvbiA9ICQodGhpcykuZmluZCgnc3BhbltpdGVtcHJvcD1uYW1lXScpLmZpcnN0KCkudGV4dCgpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgc2Vhc29uID0ge1xuICAgICAgICAgICAgICAgIGlkOiBwYXJzZUludCgvXFxkKy8uZXhlYygkc2Vhc29uKVswXSksXG4gICAgICAgICAgICAgICAgZXBpc29kZXM6IFtdXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICB3LmVycm9yKCdFcnJvciBpbiBwYXJzaW5nIFNlYXNvbiBpZCcsICRzZWFzb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0ICRlcGlzb2RlcyA9ICQodGhpcykuZmluZCgnW2l0ZW1wcm9wPVwiZXBpc29kZVwiXScpO1xuICAgICAgICAkZXBpc29kZXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxldCBlcGlzb2RlID0ge1xuICAgICAgICAgICAgICAgIG5hbWU6ICQodGhpcykuZmluZCgnW2l0ZW1wcm9wPW5hbWVdJykudGV4dCgpLnRyaW0oKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBlcGlzb2RlLmlkID0gL0VwaXNvZGUgKFxcZCspLy5leGVjKGVwaXNvZGUubmFtZSlbMV07XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgdy5lcnJvcignRXJyb3IgaW4gcGFyc2luZyBFcGlzb2RlIGlkJywgZXBpc29kZS5uYW1lKTtcbiAgICAgICAgICAgICAgICBlcGlzb2RlLmlkID0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVwaXNvZGUudmlkZW8gPSBgJHtjb25maWcud2F0Y2hzZXJpZXMudXJsfWVwaXNvZGUvJHtzZXJpYWxJZH1fcyR7c2Vhc29uLmlkfV9lJHtlcGlzb2RlLmlkfS5odG1sYFxuICAgICAgICAgICAgc2Vhc29uLmVwaXNvZGVzLnB1c2goZXBpc29kZSk7XG4gICAgICAgIH0pXG4gICAgICAgIHNlYXNvbi5lcGlzb2Rlcy5zb3J0KChhLCBiKSA9PiBiLmlkIC0gYS5pZCk7XG4gICAgICAgIHNlYXNvbnMucHVzaChzZWFzb24pO1xuICAgIH0pXG4gICAgc2Vhc29ucy5zb3J0KChhLCBiKSA9PiBhLmlkIC0gYi5pZCk7XG4gICAgcmV0dXJuIHNlYXNvbnM7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldFZpZGVvVXJsKHJlcSwgcmVzKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgbGV0IGRhdGEgPSBhd2FpdCBjYWNoZS5nZXQocmVxLmJvZHkudXJsKTtcbiAgICAgICAgaWYgKGRhdGEgJiYgcmVxLmhlYWRlcnNbJ2NhY2hlLWNvbnRyb2wnXSAhPT0gJ25vLWNhY2hlJykge1xuICAgICAgICAgICAgcmV0dXJuIHJlcy5zZW5kKEpTT04ucGFyc2UoZGF0YSkpO1xuICAgICAgICB9XG4gICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoVXJsKCk7XG4gICAgICAgIGNhY2hlLnNldChyZXEuYm9keS51cmwsIEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlKSk7XG4gICAgICAgIHJldHVybiByZXMuc2VuZChyZXNwb25zZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg1MDApLnNlbmQoZSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZnVuY3Rpb24gZmV0Y2hVcmwoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdHZXR0aW5nIEhUTUwgLSAnLCByZXEuYm9keS51cmwpO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgcmVxdWVzdChyZXEuYm9keS51cmwpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyICQgPSBjaGVlcmlvLmxvYWQocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIHZhciBwb3N0T3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBmb3JtOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcDogJ2Rvd25sb2FkMScsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2RfZnJlZTogJ0ZyZWUrRG93bmxvYWQnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0gcG9zdE9wdGlvbnM7XG4gICAgICAgICAgICAgICAgbGV0IHVybDtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB1cmwgPSAkKCdhW3RpdGxlPVwiZ29yaWxsYXZpZC5pblwiXScpLmZpcnN0KCkuYXR0cignaHJlZicpLnNwbGl0KCc9JylbMV07XG4gICAgICAgICAgICAgICAgICAgIHVybCA9IG5ldyBCdWZmZXIodXJsLCAnYmFzZTY0JykudG9TdHJpbmcoJ2FzY2lpJyk7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMudXJsID0gdXJsO1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmZvcm0uaWQgPSB1dGlsLmdldFZpZGVvSWQodXJsKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3Qob3B0aW9ucylcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pLnRoZW4oYm9keSA9PiB7XG5cbiAgICAgICAgICAgICAgICB2YXIgcGF0dGVybiA9IC9cImh0dHAoLiopKFxcLmZsdnxcXC5ta3Z8XFwubXA0KVwiLztcbiAgICAgICAgICAgICAgICB2YXIgbWF0Y2hlcyA9IHBhdHRlcm4uZXhlYyhib2R5KTtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2hlcyAmJiBtYXRjaGVzWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoeyB1cmw6IG1hdGNoZXNbMF0gfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgIH0pXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgZ2V0U2VyaWFsRGV0YWlscyxcbiAgICBnZXRWaWRlb1VybFxufSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
