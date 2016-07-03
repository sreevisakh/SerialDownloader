'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.obRequest = undefined;

var _rx = require('rx');

var _rx2 = _interopRequireDefault(_rx);

var _rxNode = require('rx-node');

var _rxNode2 = _interopRequireDefault(_rxNode);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var obRequest = exports.obRequest = _rx2.default.Observable.fromNodeCallback(_request2.default);

exports.action = function () {
    var params = {
        url: 'http://localhost:3000/data.html'
    };
    var subscription = obRequest(params).subscribe(observer);

    var observer = _rx2.default.Observer.create(function () {
        console.log('onNext');
    }, function () {
        console.log('onError');
    }, function () {
        console.log('onCompleted');
    });
};

function processData(data) {
    console.log(arguments);
    data.map(getEpisodeRange).tap(function (data) {
        console.log(data);
    });
}

function getEpisodeRange(data) {
    //console.log(data);
    // var $ = cheerio.load(data.body);
    //return Rx.Observable.just($('span:contains("Season ' + parseInt(1) + '")').parents('h2').siblings('ul').children('li').length);
    return _rx2.default.Observable.just(1);
}
//# sourceMappingURL=cheerio-rx.js.map