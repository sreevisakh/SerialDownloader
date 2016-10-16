'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _winston = require('winston');

var w = _interopRequireWildcard(_winston);

var _index = require('./watchseries/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(app) {

    app.get('/api/search', function (req, res) {
        console.log(req.query);
        var searchText = req.query.q;
        if (!searchText) {
            return res.send([]);
        } else {
            var options = {
                url: 'http://the-watch-series.to/show/search-shows-json',
                method: 'POST',
                form: {
                    term: searchText
                },
                'content-type': 'text/json'
            };
            (0, _requestPromise2.default)(options).then(function (response) {
                res.set({
                    'content-type': 'text/json'
                });
                return res.status(200).send(response);
            }, function (error) {
                w.error(error);
                return res.status(500).send(error);
            });
        }
    });
    app.get('/api/serial/:id', _index2.default.getSerialDetails);

    app.post('/api/video', _index2.default.getVideoUrl);
};

exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(_default, 'default', '/home/sv/projects/utils/SerialKiller/src/server/router.js');
}();

;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJvdXRlci5qcyJdLCJuYW1lcyI6WyJ3IiwiYXBwIiwiZ2V0IiwicmVxIiwicmVzIiwiY29uc29sZSIsImxvZyIsInF1ZXJ5Iiwic2VhcmNoVGV4dCIsInEiLCJzZW5kIiwib3B0aW9ucyIsInVybCIsIm1ldGhvZCIsImZvcm0iLCJ0ZXJtIiwidGhlbiIsInJlc3BvbnNlIiwic2V0Iiwic3RhdHVzIiwiZXJyb3IiLCJnZXRTZXJpYWxEZXRhaWxzIiwicG9zdCIsImdldFZpZGVvVXJsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOztJQUFZQSxDOztBQUNaOzs7Ozs7OztlQUVlLGtCQUFDQyxHQUFELEVBQVM7O0FBRXBCQSxRQUFJQyxHQUFKLENBQVEsYUFBUixFQUF1QixVQUFDQyxHQUFELEVBQU1DLEdBQU4sRUFBYztBQUNqQ0MsZ0JBQVFDLEdBQVIsQ0FBWUgsSUFBSUksS0FBaEI7QUFDQSxZQUFJQyxhQUFhTCxJQUFJSSxLQUFKLENBQVVFLENBQTNCO0FBQ0EsWUFBSSxDQUFDRCxVQUFMLEVBQWlCO0FBQ2IsbUJBQU9KLElBQUlNLElBQUosQ0FBUyxFQUFULENBQVA7QUFDSCxTQUZELE1BRU87QUFDSCxnQkFBSUMsVUFBVTtBQUNWQyxxQkFBSyxtREFESztBQUVWQyx3QkFBUSxNQUZFO0FBR1ZDLHNCQUFNO0FBQ0ZDLDBCQUFNUDtBQURKLGlCQUhJO0FBTVYsZ0NBQWdCO0FBTk4sYUFBZDtBQVFBLDBDQUFRRyxPQUFSLEVBQWlCSyxJQUFqQixDQUFzQixVQUFDQyxRQUFELEVBQWM7QUFDaENiLG9CQUFJYyxHQUFKLENBQVE7QUFDSixvQ0FBZ0I7QUFEWixpQkFBUjtBQUdBLHVCQUFPZCxJQUFJZSxNQUFKLENBQVcsR0FBWCxFQUFnQlQsSUFBaEIsQ0FBcUJPLFFBQXJCLENBQVA7QUFDSCxhQUxELEVBS0csaUJBQVM7QUFDUmpCLGtCQUFFb0IsS0FBRixDQUFRQSxLQUFSO0FBQ0EsdUJBQU9oQixJQUFJZSxNQUFKLENBQVcsR0FBWCxFQUFnQlQsSUFBaEIsQ0FBcUJVLEtBQXJCLENBQVA7QUFDSCxhQVJEO0FBU0g7QUFDSixLQXhCRDtBQXlCQW5CLFFBQUlDLEdBQUosQ0FBUSxpQkFBUixFQUEyQixnQkFBWW1CLGdCQUF2Qzs7QUFFQXBCLFFBQUlxQixJQUFKLENBQVMsWUFBVCxFQUF1QixnQkFBWUMsV0FBbkM7QUFDSCxDIiwiZmlsZSI6InJvdXRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCByZXF1ZXN0IGZyb20gJ3JlcXVlc3QtcHJvbWlzZSc7XG5pbXBvcnQgKiBhcyB3IGZyb20gJ3dpbnN0b24nO1xuaW1wb3J0IHdhdGNoc2VyaWVzIGZyb20gJy4vd2F0Y2hzZXJpZXMvaW5kZXgnXG5cbmV4cG9ydCBkZWZhdWx0IChhcHApID0+IHtcblxuICAgIGFwcC5nZXQoJy9hcGkvc2VhcmNoJywgKHJlcSwgcmVzKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcS5xdWVyeSk7XG4gICAgICAgIGxldCBzZWFyY2hUZXh0ID0gcmVxLnF1ZXJ5LnE7XG4gICAgICAgIGlmICghc2VhcmNoVGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcy5zZW5kKFtdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly90aGUtd2F0Y2gtc2VyaWVzLnRvL3Nob3cvc2VhcmNoLXNob3dzLWpzb24nLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIGZvcm06IHtcbiAgICAgICAgICAgICAgICAgICAgdGVybTogc2VhcmNoVGV4dFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICd0ZXh0L2pzb24nXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXF1ZXN0KG9wdGlvbnMpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzLnNldCh7XG4gICAgICAgICAgICAgICAgICAgICdjb250ZW50LXR5cGUnOiAndGV4dC9qc29uJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0sIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICB3LmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg1MDApLnNlbmQoZXJyb3IpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGFwcC5nZXQoJy9hcGkvc2VyaWFsLzppZCcsIHdhdGNoc2VyaWVzLmdldFNlcmlhbERldGFpbHMpO1xuXG4gICAgYXBwLnBvc3QoJy9hcGkvdmlkZW8nLCB3YXRjaHNlcmllcy5nZXRWaWRlb1VybCk7XG59Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
