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
                }
            };
            (0, _requestPromise2.default)(options).then(function (response) {
                return res.status(200).send(response);
            }, function (error) {
                w.error(error);
                return res.status(500).send(error);
            });
        }
    });
    app.get('/api/serial/:id', _index2.default.getSerialDetails);
};
//# sourceMappingURL=router.js.map
