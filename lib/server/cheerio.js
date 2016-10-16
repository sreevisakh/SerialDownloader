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
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(postOptions, 'postOptions', '/home/sv/projects/utils/SerialKiller/src/server/cheerio.js');

    __REACT_HOT_LOADER__.register(findEpisodeRangeInSeason, 'findEpisodeRangeInSeason', '/home/sv/projects/utils/SerialKiller/src/server/cheerio.js');

    __REACT_HOT_LOADER__.register(getHtml, 'getHtml', '/home/sv/projects/utils/SerialKiller/src/server/cheerio.js');

    __REACT_HOT_LOADER__.register(download, 'download', '/home/sv/projects/utils/SerialKiller/src/server/cheerio.js');
}();

;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNoZWVyaW8uanMiXSwibmFtZXMiOlsicG9zdE9wdGlvbnMiLCJtZXRob2QiLCJoZWFkZXJzIiwiZm9ybSIsIm9wIiwibWV0aG9kX2ZyZWUiLCJmaW5kRXBpc29kZVJhbmdlSW5TZWFzb24iLCJ1cmwiLCJzZWFzb24iLCJkZWZlcmVkIiwiZGVmZXIiLCJlcnJvciIsInJlc3BvbnNlIiwiaHRtbCIsInN0YXR1c0NvZGUiLCIkIiwibG9hZCIsImNvdW50IiwicGFyc2VJbnQiLCJwYXJlbnRzIiwic2libGluZ3MiLCJjaGlsZHJlbiIsImxlbmd0aCIsInJlc29sdmUiLCJyYW5nZSIsInJlamVjdCIsInByb21pc2UiLCJleHBvcnRzIiwiZ2V0UmVzdWx0IiwicmVxIiwicmVzIiwiYm9keSIsImh0bWxQcm9taXNlcyIsImRvd25sb2FkUHJvbWlzZXMiLCJ0aGVuIiwicmVwbGFjZSIsImVhY2giLCJpZCIsIm5hbWUiLCJmaW5kTmFtZSIsImZpbmRTZWFzb24iLCJzbGljZSIsInN1YlVybCIsInB1c2giLCJnZXRIdG1sIiwiYWxsU2V0dGxlZCIsImdvcmlsbGFVcmxzIiwiZGF0YSIsInZhbHVlIiwiZG93bmxvYWRQcm9taXNlIiwiZG93bmxvYWQiLCJyZWR1Y2UiLCJyZXN1bHQiLCJpdGVtIiwiY29uc29sZSIsImxvZyIsImZpcnN0IiwiYXR0ciIsInNwbGl0IiwiQnVmZmVyIiwidG9TdHJpbmciLCJlIiwiJHEiLCJvcHRpb25zIiwiZ2V0VmlkZW9JZCIsInBhdHRlcm4iLCJtYXRjaGVzIiwiZXhlYyJdLCJtYXBwaW5ncyI6Ijs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQVBBOztBQVVBLElBQUlBLGNBQWM7QUFDZEMsWUFBUSxNQURNO0FBRWRDLGFBQVM7QUFDTCx3QkFBZ0I7QUFEWCxLQUZLO0FBS2RDLFVBQU07QUFDRkMsWUFBSSxXQURGO0FBRUZDLHFCQUFhO0FBRlg7QUFMUSxDQUFsQjs7QUFXQSxTQUFTQyx3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Q0EzR0cxQixXOztrQ0FXS00sd0I7O2tDQWlEQXNDLE87O2tDQTBCQU0sUSIsImZpbGUiOiJjaGVlcmlvLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogZ2xvYmFsIEJ1ZmZlcixwcm9jZXNzICovXG5cbmltcG9ydCBjaGVlcmlvIGZyb20gJ2NoZWVyaW8nO1xuaW1wb3J0IHJlcXVlc3QgZnJvbSAncmVxdWVzdCc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBxIGZyb20gJ3EnO1xuaW1wb3J0IHV0aWwgZnJvbSAnLi91dGlsJztcblxuXG52YXIgcG9zdE9wdGlvbnMgPSB7XG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgaGVhZGVyczoge1xuICAgICAgICAnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcsXG4gICAgfSxcbiAgICBmb3JtOiB7XG4gICAgICAgIG9wOiAnZG93bmxvYWQxJyxcbiAgICAgICAgbWV0aG9kX2ZyZWU6ICdGcmVlK0Rvd25sb2FkJ1xuICAgIH1cbn07XG5cbmZ1bmN0aW9uIGZpbmRFcGlzb2RlUmFuZ2VJblNlYXNvbih1cmwsIHNlYXNvbikge1xuICAgIHZhciBkZWZlcmVkID0gcS5kZWZlcigpO1xuICAgIHJlcXVlc3QodXJsLCBmdW5jdGlvbihlcnJvciwgcmVzcG9uc2UsIGh0bWwpIHtcbiAgICAgICAgaWYgKCFlcnJvciAmJiByZXNwb25zZS5zdGF0dXNDb2RlID09IDIwMCkge1xuICAgICAgICAgICAgdmFyICQgPSBjaGVlcmlvLmxvYWQoaHRtbCk7XG4gICAgICAgICAgICB2YXIgY291bnQgPSAkKCdzcGFuOmNvbnRhaW5zKFwiU2Vhc29uICcgKyBwYXJzZUludChzZWFzb24pICsgJ1wiKScpLnBhcmVudHMoJ2gyJykuc2libGluZ3MoJ3VsJykuY2hpbGRyZW4oJ2xpJykubGVuZ3RoO1xuICAgICAgICAgICAgZGVmZXJlZC5yZXNvbHZlKF8ucmFuZ2UoMSwgY291bnQsIDEpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlZmVyZWQucmVqZWN0KCdGaW5kRXBpc29kZScpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGRlZmVyZWQucHJvbWlzZTtcbn1cblxuZXhwb3J0cy5nZXRSZXN1bHQgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgIHZhciB1cmwgPSByZXEuYm9keS51cmwsXG4gICAgICAgIHNlYXNvbiA9IHJlcS5ib2R5LnNlYXNvbjtcbiAgICB2YXIgaHRtbFByb21pc2VzID0gW107XG4gICAgdmFyIGRvd25sb2FkUHJvbWlzZXMgPSBbXTtcbiAgICB2YXIgZGVmZXJlZCA9IHEuZGVmZXIoKTtcbiAgICBmaW5kRXBpc29kZVJhbmdlSW5TZWFzb24ocmVxLmJvZHkudXJsLCByZXEuYm9keS5zZWFzb24pLnRoZW4oZnVuY3Rpb24ocmFuZ2UpIHtcbiAgICAgICAgdXJsID0gdXJsLnJlcGxhY2UoJy9zZXJpZS8nLCAnL2VwaXNvZGUvJyk7XG4gICAgICAgIHVybCA9IHVybCArICdfcycgKyBzZWFzb24gKyAnX2Uke2lkfS5odG1sJztcbiAgICAgICAgXy5lYWNoKHJhbmdlLCBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgdmFyIG5hbWUgPSB1dGlsLmZpbmROYW1lKHVybCkgKyAnIFMnICsgKCcwJyArIHV0aWwuZmluZFNlYXNvbih1cmwpKS5zbGljZSgtMikgKyAnRScgKyAoJzAnICsgaWQpLnNsaWNlKC0yKTtcbiAgICAgICAgICAgIHZhciBzdWJVcmwgPSB1cmwucmVwbGFjZSgnJHtpZH0nLCBpZCk7XG4gICAgICAgICAgICBodG1sUHJvbWlzZXMucHVzaChnZXRIdG1sKHN1YlVybCwgbmFtZSkpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHEuYWxsU2V0dGxlZChodG1sUHJvbWlzZXMpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24oZ29yaWxsYVVybHMpIHtcbiAgICAgICAgXy5lYWNoKGdvcmlsbGFVcmxzLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBpZiAoZGF0YS52YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhciBkb3dubG9hZFByb21pc2UgPSBkb3dubG9hZChkYXRhLnZhbHVlLnVybCwgZGF0YS52YWx1ZS5uYW1lKTtcbiAgICAgICAgICAgICAgICBkb3dubG9hZFByb21pc2VzLnB1c2goZG93bmxvYWRQcm9taXNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBxLmFsbFNldHRsZWQoZG93bmxvYWRQcm9taXNlcyk7XG4gICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICByZXNwb25zZSA9IF8ucmVkdWNlKHJlc3BvbnNlLCBmdW5jdGlvbihyZXN1bHQsIGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQgKyBpdGVtLnZhbHVlO1xuICAgICAgICB9LCAnJylcbiAgICAgICAgZGVmZXJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICBkZWZlcmVkLnJlamVjdCgnR2V0UmVzdWx0Jyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGRlZmVyZWQucHJvbWlzZTtcbn07XG5cblxuZnVuY3Rpb24gZ2V0SHRtbCh1cmwsIG5hbWUpIHtcbiAgICB2YXIgZGVmZXJlZCA9IHEuZGVmZXIoKTtcbiAgICBjb25zb2xlLmxvZygnR2V0dGluZyBIVE1MIC0gJywgdXJsKTtcbiAgICByZXF1ZXN0KHVybCwgZnVuY3Rpb24oZXJyb3IsIHJlc3BvbnNlLCBodG1sKSB7XG4gICAgICAgIGlmICghZXJyb3IgJiYgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9PSAyMDApIHtcbiAgICAgICAgICAgIHZhciAkID0gY2hlZXJpby5sb2FkKGh0bWwpO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB2YXIgdXJsID0gJCgnYVt0aXRsZT1cImdvcmlsbGF2aWQuaW5cIl0nKS5maXJzdCgpLmF0dHIoJ2hyZWYnKS5zcGxpdCgnPScpWzFdO1xuICAgICAgICAgICAgICAgIHVybCA9IG5ldyBCdWZmZXIodXJsLCAnYmFzZTY0JykudG9TdHJpbmcoJ2FzY2lpJyk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgdXJsID0gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGVmZXJlZC5yZXNvbHZlKHtcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICBuYW1lOiBuYW1lXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChyZXNwb25zZS5zdGF0dXNDb2RlID09IDQwNCkge1xuICAgICAgICAgICAgZGVmZXJlZC5yZXNvbHZlKG51bGwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVmZXJlZC5yZWplY3QoXCJHZXQgSHRtbFwiKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBkZWZlcmVkLnByb21pc2U7XG59XG5cbmZ1bmN0aW9uIGRvd25sb2FkKHVybCwgbmFtZSkge1xuICAgIGlmICghdXJsKSByZXR1cm4gJHEucmVqZWN0KCdVcmwgaXMgZW1wdHknKTtcbiAgICBjb25zb2xlLmxvZygnRG93bmxvYWRpbmcgJyArIG5hbWUpO1xuICAgIHZhciBvcHRpb25zID0gcG9zdE9wdGlvbnM7XG4gICAgb3B0aW9ucy51cmwgPSB1cmw7XG4gICAgb3B0aW9ucy5mb3JtLmlkID0gdXRpbC5nZXRWaWRlb0lkKHVybCk7XG4gICAgdmFyIGRlZmVyZWQgPSBxLmRlZmVyKCk7XG4gICAgcmVxdWVzdChvcHRpb25zLCBmdW5jdGlvbihlcnJvciwgcmVzcG9uc2UsIGJvZHkpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0Rvd25sb2FkaW5nIGRvbmU6JyArIG5hbWUpO1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGRlZmVyZWQucmVqZWN0KCdEb3dubG9hZCcgKyB1cmwpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwYXR0ZXJuID0gL1wiaHR0cCguKikoXFwuZmx2fFxcLm1rdnxcXC5tcDQpXCIvO1xuICAgICAgICB2YXIgbWF0Y2hlcyA9IHBhdHRlcm4uZXhlYyhib2R5KTtcbiAgICAgICAgaWYgKG1hdGNoZXMgJiYgbWF0Y2hlc1swXSkge1xuICAgICAgICAgICAgZGVmZXJlZC5yZXNvbHZlKCc8YnI+PGEgZG93bmxvYWQ9XCInICsgbmFtZSArICdcIiBocmVmPScgKyBtYXRjaGVzWzBdICsgJz4nICsgbmFtZSArICc8L2E+Jyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWZlcmVkLnJlc29sdmUoXCJcIik7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGVmZXJlZC5wcm9taXNlO1xufSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
