'use strict';

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global Buffer,process */

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

function findEpisodeRangeInSeason(url, season) {
    var defered = _q2.default.defer();
    (0, _request2.default)(url, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = _cheerio2.default.load(html);
            var count = $('span:contains("Season ' + parseInt(season) + '")').parents('h2').siblings('ul').children('li').length;
            defered.resolve(_lodash2.default.range(1, count, 1));
        } else {
            defered.reject('FindEpisode');
        }
    });
    return defered.promise;
}

exports.getResult = function (req, res) {
    var url = req.body.url,
        season = req.body.season;
    var htmlPromises = [];
    var downloadPromises = [];
    var defered = _q2.default.defer();
    findEpisodeRangeInSeason(req.body.url, req.body.season).then(function (range) {
        url = url.replace('/serie/', '/episode/');
        url = url + '_s' + season + '_e${id}.html';
        _lodash2.default.each(range, function (id) {
            var name = _util2.default.findName(url) + ' S' + ('0' + _util2.default.findSeason(url)).slice(-2) + 'E' + ('0' + id).slice(-2);
            var subUrl = url.replace('${id}', id);
            htmlPromises.push(getHtml(subUrl, name));
        });
        return _q2.default.allSettled(htmlPromises);
    }).then(function (gorillaUrls) {
        _lodash2.default.each(gorillaUrls, function (data) {
            if (data.value) {
                var downloadPromise = download(data.value.url, data.value.name);
                downloadPromises.push(downloadPromise);
            }
        });
        return _q2.default.allSettled(downloadPromises);
    }).then(function (response) {
        response = _lodash2.default.reduce(response, function (result, item) {
            return result + item.value;
        }, '');
        defered.resolve(response);
    }, function (error) {
        defered.reject('GetResult');
    });
    return defered.promise;
};

function getHtml(url, name) {
    var defered = _q2.default.defer();
    console.log('Getting HTML - ', url);
    (0, _request2.default)(url, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = _cheerio2.default.load(html);
            try {
                var url = $('a[title="gorillavid.in"]').first().attr('href').split('=')[1];
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
    if (!url) return $q.reject('Url is empty');
    console.log('Downloading ' + name);
    var options = postOptions;
    options.url = url;
    options.form.id = _util2.default.getVideoId(url);
    var defered = _q2.default.defer();
    (0, _request2.default)(options, function (error, response, body) {
        console.log('Downloading done:' + name);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNoZWVyaW8uanMiXSwibmFtZXMiOlsicG9zdE9wdGlvbnMiLCJtZXRob2QiLCJoZWFkZXJzIiwiZm9ybSIsIm9wIiwibWV0aG9kX2ZyZWUiLCJmaW5kRXBpc29kZVJhbmdlSW5TZWFzb24iLCJ1cmwiLCJzZWFzb24iLCJkZWZlcmVkIiwiZGVmZXIiLCJlcnJvciIsInJlc3BvbnNlIiwiaHRtbCIsInN0YXR1c0NvZGUiLCIkIiwibG9hZCIsImNvdW50IiwicGFyc2VJbnQiLCJwYXJlbnRzIiwic2libGluZ3MiLCJjaGlsZHJlbiIsImxlbmd0aCIsInJlc29sdmUiLCJyYW5nZSIsInJlamVjdCIsInByb21pc2UiLCJleHBvcnRzIiwiZ2V0UmVzdWx0IiwicmVxIiwicmVzIiwiYm9keSIsImh0bWxQcm9taXNlcyIsImRvd25sb2FkUHJvbWlzZXMiLCJ0aGVuIiwicmVwbGFjZSIsImVhY2giLCJpZCIsIm5hbWUiLCJmaW5kTmFtZSIsImZpbmRTZWFzb24iLCJzbGljZSIsInN1YlVybCIsInB1c2giLCJnZXRIdG1sIiwiYWxsU2V0dGxlZCIsImdvcmlsbGFVcmxzIiwiZGF0YSIsInZhbHVlIiwiZG93bmxvYWRQcm9taXNlIiwiZG93bmxvYWQiLCJyZWR1Y2UiLCJyZXN1bHQiLCJpdGVtIiwiY29uc29sZSIsImxvZyIsImZpcnN0IiwiYXR0ciIsInNwbGl0IiwiQnVmZmVyIiwidG9TdHJpbmciLCJlIiwiJHEiLCJvcHRpb25zIiwiZ2V0VmlkZW9JZCIsInBhdHRlcm4iLCJtYXRjaGVzIiwiZXhlYyJdLCJtYXBwaW5ncyI6Ijs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQVBBOztBQVVBLElBQUlBLGNBQWM7QUFDZEMsWUFBUSxNQURNO0FBRWRDLGFBQVM7QUFDTCx3QkFBZ0I7QUFEWCxLQUZLO0FBS2RDLFVBQU07QUFDRkMsWUFBSSxXQURGO0FBRUZDLHFCQUFhO0FBRlg7QUFMUSxDQUFsQjs7QUFXQSxTQUFTQyx3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ImNoZWVyaW8uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBnbG9iYWwgQnVmZmVyLHByb2Nlc3MgKi9cblxuaW1wb3J0IGNoZWVyaW8gZnJvbSAnY2hlZXJpbyc7XG5pbXBvcnQgcmVxdWVzdCBmcm9tICdyZXF1ZXN0JztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHEgZnJvbSAncSc7XG5pbXBvcnQgdXRpbCBmcm9tICcuL3V0aWwnO1xuXG5cbnZhciBwb3N0T3B0aW9ucyA9IHtcbiAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICBoZWFkZXJzOiB7XG4gICAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgICB9LFxuICAgIGZvcm06IHtcbiAgICAgICAgb3A6ICdkb3dubG9hZDEnLFxuICAgICAgICBtZXRob2RfZnJlZTogJ0ZyZWUrRG93bmxvYWQnXG4gICAgfVxufTtcblxuZnVuY3Rpb24gZmluZEVwaXNvZGVSYW5nZUluU2Vhc29uKHVybCwgc2Vhc29uKSB7XG4gICAgdmFyIGRlZmVyZWQgPSBxLmRlZmVyKCk7XG4gICAgcmVxdWVzdCh1cmwsIGZ1bmN0aW9uKGVycm9yLCByZXNwb25zZSwgaHRtbCkge1xuICAgICAgICBpZiAoIWVycm9yICYmIHJlc3BvbnNlLnN0YXR1c0NvZGUgPT0gMjAwKSB7XG4gICAgICAgICAgICB2YXIgJCA9IGNoZWVyaW8ubG9hZChodG1sKTtcbiAgICAgICAgICAgIHZhciBjb3VudCA9ICQoJ3NwYW46Y29udGFpbnMoXCJTZWFzb24gJyArIHBhcnNlSW50KHNlYXNvbikgKyAnXCIpJykucGFyZW50cygnaDInKS5zaWJsaW5ncygndWwnKS5jaGlsZHJlbignbGknKS5sZW5ndGg7XG4gICAgICAgICAgICBkZWZlcmVkLnJlc29sdmUoXy5yYW5nZSgxLCBjb3VudCwgMSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVmZXJlZC5yZWplY3QoJ0ZpbmRFcGlzb2RlJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGVmZXJlZC5wcm9taXNlO1xufVxuXG5leHBvcnRzLmdldFJlc3VsdCA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgdmFyIHVybCA9IHJlcS5ib2R5LnVybCxcbiAgICAgICAgc2Vhc29uID0gcmVxLmJvZHkuc2Vhc29uO1xuICAgIHZhciBodG1sUHJvbWlzZXMgPSBbXTtcbiAgICB2YXIgZG93bmxvYWRQcm9taXNlcyA9IFtdO1xuICAgIHZhciBkZWZlcmVkID0gcS5kZWZlcigpO1xuICAgIGZpbmRFcGlzb2RlUmFuZ2VJblNlYXNvbihyZXEuYm9keS51cmwsIHJlcS5ib2R5LnNlYXNvbikudGhlbihmdW5jdGlvbihyYW5nZSkge1xuICAgICAgICB1cmwgPSB1cmwucmVwbGFjZSgnL3NlcmllLycsICcvZXBpc29kZS8nKTtcbiAgICAgICAgdXJsID0gdXJsICsgJ19zJyArIHNlYXNvbiArICdfZSR7aWR9Lmh0bWwnO1xuICAgICAgICBfLmVhY2gocmFuZ2UsIGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICB2YXIgbmFtZSA9IHV0aWwuZmluZE5hbWUodXJsKSArICcgUycgKyAoJzAnICsgdXRpbC5maW5kU2Vhc29uKHVybCkpLnNsaWNlKC0yKSArICdFJyArICgnMCcgKyBpZCkuc2xpY2UoLTIpO1xuICAgICAgICAgICAgdmFyIHN1YlVybCA9IHVybC5yZXBsYWNlKCcke2lkfScsIGlkKTtcbiAgICAgICAgICAgIGh0bWxQcm9taXNlcy5wdXNoKGdldEh0bWwoc3ViVXJsLCBuYW1lKSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcS5hbGxTZXR0bGVkKGh0bWxQcm9taXNlcyk7XG4gICAgfSkudGhlbihmdW5jdGlvbihnb3JpbGxhVXJscykge1xuICAgICAgICBfLmVhY2goZ29yaWxsYVVybHMsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChkYXRhLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRvd25sb2FkUHJvbWlzZSA9IGRvd25sb2FkKGRhdGEudmFsdWUudXJsLCBkYXRhLnZhbHVlLm5hbWUpO1xuICAgICAgICAgICAgICAgIGRvd25sb2FkUHJvbWlzZXMucHVzaChkb3dubG9hZFByb21pc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHEuYWxsU2V0dGxlZChkb3dubG9hZFByb21pc2VzKTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIHJlc3BvbnNlID0gXy5yZWR1Y2UocmVzcG9uc2UsIGZ1bmN0aW9uKHJlc3VsdCwgaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdCArIGl0ZW0udmFsdWU7XG4gICAgICAgIH0sICcnKVxuICAgICAgICBkZWZlcmVkLnJlc29sdmUocmVzcG9uc2UpO1xuICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIGRlZmVyZWQucmVqZWN0KCdHZXRSZXN1bHQnKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZGVmZXJlZC5wcm9taXNlO1xufTtcblxuXG5mdW5jdGlvbiBnZXRIdG1sKHVybCwgbmFtZSkge1xuICAgIHZhciBkZWZlcmVkID0gcS5kZWZlcigpO1xuICAgIGNvbnNvbGUubG9nKCdHZXR0aW5nIEhUTUwgLSAnLCB1cmwpO1xuICAgIHJlcXVlc3QodXJsLCBmdW5jdGlvbihlcnJvciwgcmVzcG9uc2UsIGh0bWwpIHtcbiAgICAgICAgaWYgKCFlcnJvciAmJiByZXNwb25zZS5zdGF0dXNDb2RlID09IDIwMCkge1xuICAgICAgICAgICAgdmFyICQgPSBjaGVlcmlvLmxvYWQoaHRtbCk7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHZhciB1cmwgPSAkKCdhW3RpdGxlPVwiZ29yaWxsYXZpZC5pblwiXScpLmZpcnN0KCkuYXR0cignaHJlZicpLnNwbGl0KCc9JylbMV07XG4gICAgICAgICAgICAgICAgdXJsID0gbmV3IEJ1ZmZlcih1cmwsICdiYXNlNjQnKS50b1N0cmluZygnYXNjaWknKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICB1cmwgPSBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkZWZlcmVkLnJlc29sdmUoe1xuICAgICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICAgIG5hbWU6IG5hbWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1c0NvZGUgPT0gNDA0KSB7XG4gICAgICAgICAgICBkZWZlcmVkLnJlc29sdmUobnVsbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWZlcmVkLnJlamVjdChcIkdldCBIdG1sXCIpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGRlZmVyZWQucHJvbWlzZTtcbn1cblxuZnVuY3Rpb24gZG93bmxvYWQodXJsLCBuYW1lKSB7XG4gICAgaWYgKCF1cmwpIHJldHVybiAkcS5yZWplY3QoJ1VybCBpcyBlbXB0eScpO1xuICAgIGNvbnNvbGUubG9nKCdEb3dubG9hZGluZyAnICsgbmFtZSk7XG4gICAgdmFyIG9wdGlvbnMgPSBwb3N0T3B0aW9ucztcbiAgICBvcHRpb25zLnVybCA9IHVybDtcbiAgICBvcHRpb25zLmZvcm0uaWQgPSB1dGlsLmdldFZpZGVvSWQodXJsKTtcbiAgICB2YXIgZGVmZXJlZCA9IHEuZGVmZXIoKTtcbiAgICByZXF1ZXN0KG9wdGlvbnMsIGZ1bmN0aW9uKGVycm9yLCByZXNwb25zZSwgYm9keSkge1xuICAgICAgICBjb25zb2xlLmxvZygnRG93bmxvYWRpbmcgZG9uZTonICsgbmFtZSk7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgZGVmZXJlZC5yZWplY3QoJ0Rvd25sb2FkJyArIHVybCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBhdHRlcm4gPSAvXCJodHRwKC4qKShcXC5mbHZ8XFwubWt2fFxcLm1wNClcIi87XG4gICAgICAgIHZhciBtYXRjaGVzID0gcGF0dGVybi5leGVjKGJvZHkpO1xuICAgICAgICBpZiAobWF0Y2hlcyAmJiBtYXRjaGVzWzBdKSB7XG4gICAgICAgICAgICBkZWZlcmVkLnJlc29sdmUoJzxicj48YSBkb3dubG9hZD1cIicgKyBuYW1lICsgJ1wiIGhyZWY9JyArIG1hdGNoZXNbMF0gKyAnPicgKyBuYW1lICsgJzwvYT4nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlZmVyZWQucmVzb2x2ZShcIlwiKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBkZWZlcmVkLnByb21pc2U7XG59Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
