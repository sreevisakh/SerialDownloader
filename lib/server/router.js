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

exports.default = function (app) {

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
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJvdXRlci5qcyJdLCJuYW1lcyI6WyJ3IiwiYXBwIiwiZ2V0IiwicmVxIiwicmVzIiwiY29uc29sZSIsImxvZyIsInF1ZXJ5Iiwic2VhcmNoVGV4dCIsInEiLCJzZW5kIiwib3B0aW9ucyIsInVybCIsIm1ldGhvZCIsImZvcm0iLCJ0ZXJtIiwidGhlbiIsInJlc3BvbnNlIiwic2V0Iiwic3RhdHVzIiwiZXJyb3IiLCJnZXRTZXJpYWxEZXRhaWxzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOztJQUFZQSxDOztBQUNaOzs7Ozs7OztrQkFFZSxVQUFDQyxHQUFELEVBQVM7O0FBRXBCQSxRQUFJQyxHQUFKLENBQVEsYUFBUixFQUF1QixVQUFDQyxHQUFELEVBQU1DLEdBQU4sRUFBYztBQUNqQ0MsZ0JBQVFDLEdBQVIsQ0FBWUgsSUFBSUksS0FBaEI7QUFDQSxZQUFJQyxhQUFhTCxJQUFJSSxLQUFKLENBQVVFLENBQTNCO0FBQ0EsWUFBSSxDQUFDRCxVQUFMLEVBQWlCO0FBQ2IsbUJBQU9KLElBQUlNLElBQUosQ0FBUyxFQUFULENBQVA7QUFDSCxTQUZELE1BRU87QUFDSCxnQkFBSUMsVUFBVTtBQUNWQyxxQkFBSyxtREFESztBQUVWQyx3QkFBUSxNQUZFO0FBR1ZDLHNCQUFNO0FBQ0ZDLDBCQUFNUDtBQURKLGlCQUhJO0FBTVYsZ0NBQWdCO0FBTk4sYUFBZDtBQVFBLDBDQUFRRyxPQUFSLEVBQWlCSyxJQUFqQixDQUFzQixVQUFDQyxRQUFELEVBQWM7QUFDaENiLG9CQUFJYyxHQUFKLENBQVE7QUFDSixvQ0FBZ0I7QUFEWixpQkFBUjtBQUdBLHVCQUFPZCxJQUFJZSxNQUFKLENBQVcsR0FBWCxFQUFnQlQsSUFBaEIsQ0FBcUJPLFFBQXJCLENBQVA7QUFDSCxhQUxELEVBS0csaUJBQVM7QUFDUmpCLGtCQUFFb0IsS0FBRixDQUFRQSxLQUFSO0FBQ0EsdUJBQU9oQixJQUFJZSxNQUFKLENBQVcsR0FBWCxFQUFnQlQsSUFBaEIsQ0FBcUJVLEtBQXJCLENBQVA7QUFDSCxhQVJEO0FBU0g7QUFDSixLQXhCRDtBQXlCQW5CLFFBQUlDLEdBQUosQ0FBUSxpQkFBUixFQUEyQixnQkFBWW1CLGdCQUF2QztBQUNILEMiLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHJlcXVlc3QgZnJvbSAncmVxdWVzdC1wcm9taXNlJztcbmltcG9ydCAqIGFzIHcgZnJvbSAnd2luc3Rvbic7XG5pbXBvcnQgd2F0Y2hzZXJpZXMgZnJvbSAnLi93YXRjaHNlcmllcy9pbmRleCdcblxuZXhwb3J0IGRlZmF1bHQgKGFwcCkgPT4ge1xuXG4gICAgYXBwLmdldCgnL2FwaS9zZWFyY2gnLCAocmVxLCByZXMpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2cocmVxLnF1ZXJ5KTtcbiAgICAgICAgbGV0IHNlYXJjaFRleHQgPSByZXEucXVlcnkucTtcbiAgICAgICAgaWYgKCFzZWFyY2hUZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzLnNlbmQoW10pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL3RoZS13YXRjaC1zZXJpZXMudG8vc2hvdy9zZWFyY2gtc2hvd3MtanNvbicsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgZm9ybToge1xuICAgICAgICAgICAgICAgICAgICB0ZXJtOiBzZWFyY2hUZXh0XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnY29udGVudC10eXBlJzogJ3RleHQvanNvbidcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlcXVlc3Qob3B0aW9ucykudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICByZXMuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICd0ZXh0L2pzb24nXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQocmVzcG9uc2UpO1xuICAgICAgICAgICAgfSwgZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgIHcuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuc2VuZChlcnJvcik7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgYXBwLmdldCgnL2FwaS9zZXJpYWwvOmlkJywgd2F0Y2hzZXJpZXMuZ2V0U2VyaWFsRGV0YWlscylcbn0iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
