'use strict';

var Rx = require('rx');
var RxNode = require('rx-node');
var request = require('request');
var _ = require('lodash');
var cheerio = require('cheerio');

exports.getResult = function (req, res) {
    var result = '';
    fetchContent({
        url: req.body.url
    }, req.body.season).flatMap(getEpisodeRange).map(formEpisodeUrl.bind(null, req.body.url, req.body.season)).flatMap(downloadHtml).map(getGorillaUrl).flatMap(postToGorilla).map(getVideoUrl).flatMap(prepareHtml).subscribe(function (data) {
        result += data;
    }, function (error) {
        res.send(JSON.stringify(error));
    }, function () {
        res.send(result);
    });
};

function fetchContent(params) {
    console.log(params.url);
    var args = [].slice.call(arguments, 1);
    return Rx.Observable.create(function (observer) {
        request(params, function (error, response, body) {
            if (error) {
                observer.onError();
            } else if (response.statusCode === 200) {
                observer.onNext({
                    name: params.name,
                    response: response,
                    body: body,
                    args: args
                });
            } else {

                observer.onError();
            }
            observer.onCompleted();
        });
    });
};

function prepareHtml(_ref) {
    var url = _ref.url;
    var name = _ref.name;

    return '<a href=' + url + '>' + name + '</a><br>';
}

function fileName(url, season, episode) {
    return _.last(url.split('/')).replace('_', ' ').concat(' S' + ('0' + (season + '')).slice(-2) + 'E' + ('0' + (episode + '')).slice(-2));
}

function getVideoUrl(data) {
    var pattern = /"http(.*)(\.flv|\.mkv|\.mp4)"/;
    var matches = pattern.exec(data.body);
    if (matches && matches[0]) {
        return { url: matches[0], name: data.name };
    } else {
        return null;
    }
}

function postToGorilla(_ref2) {
    var url = _ref2.url;
    var name = _ref2.name;

    var params = {
        name: name,
        url: url,
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        form: {
            op: 'download1',
            method_free: 'Free+Download',
            id: _.last(url.split('/'))
        }
    };
    return fetchContent(params);
}

function getGorillaUrl(data) {
    try {
        var $ = cheerio.load(data.body);
        var url = $('a[title="gorillavid.in"]').first().attr('href').split('=')[1];
        return { url: new Buffer(url, 'base64').toString('ascii'), name: data.name };
    } catch (error) {
        return Rx.Observable.just(null);
    }
}

function downloadHtml(_ref3) {
    var url = _ref3.url;
    var name = _ref3.name;

    return fetchContent({
        url: url,
        name: name
    });
}

function formEpisodeUrl(url, season, episode) {
    return { url: url.replace('/serie/', '/episode/').concat('_s' + season + '_e' + episode + '.html'), name: fileName(url, season, episode) };
}

function getEpisodeRange(data) {
    var $ = cheerio.load(data.body);
    return _.range(1, $('span').filter(function () {
        return $(this).text() === 'Season ' + data.args[0];
    }).parents('h2').siblings('ul').children('li').length + 1 || 0, 1);
}
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(fetchContent, 'fetchContent', '/home/sv/projects/utils/SerialKiller/src/server/cheerio-rx.js');

    __REACT_HOT_LOADER__.register(prepareHtml, 'prepareHtml', '/home/sv/projects/utils/SerialKiller/src/server/cheerio-rx.js');

    __REACT_HOT_LOADER__.register(fileName, 'fileName', '/home/sv/projects/utils/SerialKiller/src/server/cheerio-rx.js');

    __REACT_HOT_LOADER__.register(getVideoUrl, 'getVideoUrl', '/home/sv/projects/utils/SerialKiller/src/server/cheerio-rx.js');

    __REACT_HOT_LOADER__.register(postToGorilla, 'postToGorilla', '/home/sv/projects/utils/SerialKiller/src/server/cheerio-rx.js');

    __REACT_HOT_LOADER__.register(getGorillaUrl, 'getGorillaUrl', '/home/sv/projects/utils/SerialKiller/src/server/cheerio-rx.js');

    __REACT_HOT_LOADER__.register(downloadHtml, 'downloadHtml', '/home/sv/projects/utils/SerialKiller/src/server/cheerio-rx.js');

    __REACT_HOT_LOADER__.register(formEpisodeUrl, 'formEpisodeUrl', '/home/sv/projects/utils/SerialKiller/src/server/cheerio-rx.js');

    __REACT_HOT_LOADER__.register(getEpisodeRange, 'getEpisodeRange', '/home/sv/projects/utils/SerialKiller/src/server/cheerio-rx.js');
}();

;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNoZWVyaW8tcnguanMiXSwibmFtZXMiOlsiUngiLCJyZXF1aXJlIiwiUnhOb2RlIiwicmVxdWVzdCIsIl8iLCJjaGVlcmlvIiwiZXhwb3J0cyIsImdldFJlc3VsdCIsInJlcSIsInJlcyIsInJlc3VsdCIsImZldGNoQ29udGVudCIsInVybCIsImJvZHkiLCJzZWFzb24iLCJmbGF0TWFwIiwiZ2V0RXBpc29kZVJhbmdlIiwibWFwIiwiZm9ybUVwaXNvZGVVcmwiLCJiaW5kIiwiZG93bmxvYWRIdG1sIiwiZ2V0R29yaWxsYVVybCIsInBvc3RUb0dvcmlsbGEiLCJnZXRWaWRlb1VybCIsInByZXBhcmVIdG1sIiwic3Vic2NyaWJlIiwiZGF0YSIsImVycm9yIiwic2VuZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJwYXJhbXMiLCJjb25zb2xlIiwibG9nIiwiYXJncyIsInNsaWNlIiwiY2FsbCIsImFyZ3VtZW50cyIsIk9ic2VydmFibGUiLCJjcmVhdGUiLCJvYnNlcnZlciIsInJlc3BvbnNlIiwib25FcnJvciIsInN0YXR1c0NvZGUiLCJvbk5leHQiLCJuYW1lIiwib25Db21wbGV0ZWQiLCJmaWxlTmFtZSIsImVwaXNvZGUiLCJsYXN0Iiwic3BsaXQiLCJyZXBsYWNlIiwiY29uY2F0IiwicGF0dGVybiIsIm1hdGNoZXMiLCJleGVjIiwibWV0aG9kIiwiaGVhZGVycyIsImZvcm0iLCJvcCIsIm1ldGhvZF9mcmVlIiwiaWQiLCIkIiwibG9hZCIsImZpcnN0IiwiYXR0ciIsIkJ1ZmZlciIsInRvU3RyaW5nIiwianVzdCIsInJhbmdlIiwiZmlsdGVyIiwidGV4dCIsInBhcmVudHMiLCJzaWJsaW5ncyIsImNoaWxkcmVuIiwibGVuZ3RoIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLEtBQUtDLFFBQVEsSUFBUixDQUFUO0FBQ0EsSUFBSUMsU0FBU0QsUUFBUSxTQUFSLENBQWI7QUFDQSxJQUFJRSxVQUFVRixRQUFRLFNBQVIsQ0FBZDtBQUNBLElBQUlHLElBQUlILFFBQVEsUUFBUixDQUFSO0FBQ0EsSUFBSUksVUFBVUosUUFBUSxTQUFSLENBQWQ7O0FBRUFLLFFBQVFDLFNBQVIsR0FBb0IsVUFBU0MsR0FBVCxFQUFjQyxHQUFkLEVBQW1CO0FBQ25DLFFBQUlDLFNBQVMsRUFBYjtBQUNBQyxpQkFBYTtBQUNMQyxhQUFLSixJQUFJSyxJQUFKLENBQVNEO0FBRFQsS0FBYixFQUVPSixJQUFJSyxJQUFKLENBQVNDLE1BRmhCLEVBR0tDLE9BSEwsQ0FHYUMsZUFIYixFQUlLQyxHQUpMLENBSVNDLGVBQWVDLElBQWYsQ0FBb0IsSUFBcEIsRUFBMEJYLElBQUlLLElBQUosQ0FBU0QsR0FBbkMsRUFBd0NKLElBQUlLLElBQUosQ0FBU0MsTUFBakQsQ0FKVCxFQUtLQyxPQUxMLENBS2FLLFlBTGIsRUFNS0gsR0FOTCxDQU1TSSxhQU5ULEVBT0tOLE9BUEwsQ0FPYU8sYUFQYixFQVFLTCxHQVJMLENBUVNNLFdBUlQsRUFTS1IsT0FUTCxDQVNhUyxXQVRiLEVBVUtDLFNBVkwsQ0FVZSxVQUFTQyxJQUFULEVBQWU7QUFDdEJoQixrQkFBVWdCLElBQVY7QUFDSCxLQVpMLEVBWU8sVUFBU0MsS0FBVCxFQUFnQjtBQUNmbEIsWUFBSW1CLElBQUosQ0FBU0MsS0FBS0MsU0FBTCxDQUFlSCxLQUFmLENBQVQ7QUFDSCxLQWRMLEVBY08sWUFBVztBQUNWbEIsWUFBSW1CLElBQUosQ0FBU2xCLE1BQVQ7QUFDSCxLQWhCTDtBQWlCSCxDQW5CRDs7QUFzQkEsU0FBU0MsWUFBVCxDQUFzQm9CLE1BQXRCLEVBQThCO0FBQzFCQyxZQUFRQyxHQUFSLENBQVlGLE9BQU9uQixHQUFuQjtBQUNBLFFBQUlzQixPQUFPLEdBQUdDLEtBQUgsQ0FBU0MsSUFBVCxDQUFjQyxTQUFkLEVBQXlCLENBQXpCLENBQVg7QUFDQSxXQUFPckMsR0FBR3NDLFVBQUgsQ0FBY0MsTUFBZCxDQUFxQixVQUFTQyxRQUFULEVBQW1CO0FBQzNDckMsZ0JBQVE0QixNQUFSLEVBQWdCLFVBQVNKLEtBQVQsRUFBZ0JjLFFBQWhCLEVBQTBCNUIsSUFBMUIsRUFBZ0M7QUFDNUMsZ0JBQUljLEtBQUosRUFBVztBQUNQYSx5QkFBU0UsT0FBVDtBQUNILGFBRkQsTUFFTyxJQUFJRCxTQUFTRSxVQUFULEtBQXdCLEdBQTVCLEVBQWlDO0FBQ3BDSCx5QkFBU0ksTUFBVCxDQUFnQjtBQUNaQywwQkFBTWQsT0FBT2MsSUFERDtBQUVaSixzQ0FGWTtBQUdaNUIsOEJBSFk7QUFJWnFCO0FBSlksaUJBQWhCO0FBTUgsYUFQTSxNQU9BOztBQUVITSx5QkFBU0UsT0FBVDtBQUNIO0FBQ0RGLHFCQUFTTSxXQUFUO0FBQ0gsU0FmRDtBQWdCSCxLQWpCTSxDQUFQO0FBa0JIOztBQUVELFNBQVN0QixXQUFULE9BQW9DO0FBQUEsUUFBYlosR0FBYSxRQUFiQSxHQUFhO0FBQUEsUUFBUmlDLElBQVEsUUFBUkEsSUFBUTs7QUFDaEMsd0JBQWtCakMsR0FBbEIsU0FBeUJpQyxJQUF6QjtBQUNIOztBQUVELFNBQVNFLFFBQVQsQ0FBa0JuQyxHQUFsQixFQUF1QkUsTUFBdkIsRUFBK0JrQyxPQUEvQixFQUF3QztBQUNwQyxXQUFPNUMsRUFBRTZDLElBQUYsQ0FBT3JDLElBQUlzQyxLQUFKLENBQVUsR0FBVixDQUFQLEVBQXVCQyxPQUF2QixDQUErQixHQUEvQixFQUFvQyxHQUFwQyxFQUF5Q0MsTUFBekMsQ0FBZ0QsT0FBTyxDQUFDLE9BQU90QyxTQUFTLEVBQWhCLENBQUQsRUFBc0JxQixLQUF0QixDQUE0QixDQUFDLENBQTdCLENBQVAsR0FBeUMsR0FBekMsR0FBK0MsQ0FBQyxPQUFPYSxVQUFVLEVBQWpCLENBQUQsRUFBdUJiLEtBQXZCLENBQTZCLENBQUMsQ0FBOUIsQ0FBL0YsQ0FBUDtBQUNIOztBQUVELFNBQVNaLFdBQVQsQ0FBcUJHLElBQXJCLEVBQTJCO0FBQ3ZCLFFBQUkyQixVQUFVLCtCQUFkO0FBQ0EsUUFBSUMsVUFBVUQsUUFBUUUsSUFBUixDQUFhN0IsS0FBS2IsSUFBbEIsQ0FBZDtBQUNBLFFBQUl5QyxXQUFXQSxRQUFRLENBQVIsQ0FBZixFQUEyQjtBQUN2QixlQUFPLEVBQUUxQyxLQUFLMEMsUUFBUSxDQUFSLENBQVAsRUFBbUJULE1BQU1uQixLQUFLbUIsSUFBOUIsRUFBUDtBQUNILEtBRkQsTUFFTztBQUNILGVBQU8sSUFBUDtBQUNIO0FBQ0o7O0FBRUQsU0FBU3ZCLGFBQVQsUUFBc0M7QUFBQSxRQUFiVixHQUFhLFNBQWJBLEdBQWE7QUFBQSxRQUFSaUMsSUFBUSxTQUFSQSxJQUFROztBQUNsQyxRQUFJZCxTQUFTO0FBQ1RjLGNBQU1BLElBREc7QUFFVGpDLGFBQUtBLEdBRkk7QUFHVDRDLGdCQUFRLE1BSEM7QUFJVEMsaUJBQVM7QUFDTCw0QkFBZ0I7QUFEWCxTQUpBO0FBT1RDLGNBQU07QUFDRkMsZ0JBQUksV0FERjtBQUVGQyx5QkFBYSxlQUZYO0FBR0ZDLGdCQUFJekQsRUFBRTZDLElBQUYsQ0FBT3JDLElBQUlzQyxLQUFKLENBQVUsR0FBVixDQUFQO0FBSEY7QUFQRyxLQUFiO0FBYUEsV0FBT3ZDLGFBQWFvQixNQUFiLENBQVA7QUFDSDs7QUFFRCxTQUFTVixhQUFULENBQXVCSyxJQUF2QixFQUE2QjtBQUN6QixRQUFJO0FBQ0EsWUFBSW9DLElBQUl6RCxRQUFRMEQsSUFBUixDQUFhckMsS0FBS2IsSUFBbEIsQ0FBUjtBQUNBLFlBQUlELE1BQU1rRCxFQUFFLDBCQUFGLEVBQThCRSxLQUE5QixHQUFzQ0MsSUFBdEMsQ0FBMkMsTUFBM0MsRUFBbURmLEtBQW5ELENBQXlELEdBQXpELEVBQThELENBQTlELENBQVY7QUFDQSxlQUFPLEVBQUV0QyxLQUFLLElBQUlzRCxNQUFKLENBQVd0RCxHQUFYLEVBQWdCLFFBQWhCLEVBQTBCdUQsUUFBMUIsQ0FBbUMsT0FBbkMsQ0FBUCxFQUFvRHRCLE1BQU1uQixLQUFLbUIsSUFBL0QsRUFBUDtBQUNILEtBSkQsQ0FJRSxPQUFPbEIsS0FBUCxFQUFjO0FBQ1osZUFBTzNCLEdBQUdzQyxVQUFILENBQWM4QixJQUFkLENBQW1CLElBQW5CLENBQVA7QUFDSDtBQUNKOztBQUVELFNBQVNoRCxZQUFULFFBQXFDO0FBQUEsUUFBYlIsR0FBYSxTQUFiQSxHQUFhO0FBQUEsUUFBUmlDLElBQVEsU0FBUkEsSUFBUTs7QUFDakMsV0FBT2xDLGFBQWE7QUFDaEJDLGdCQURnQjtBQUVoQmlDO0FBRmdCLEtBQWIsQ0FBUDtBQUlIOztBQUVELFNBQVMzQixjQUFULENBQXdCTixHQUF4QixFQUE2QkUsTUFBN0IsRUFBcUNrQyxPQUFyQyxFQUE4QztBQUMxQyxXQUFPLEVBQUVwQyxLQUFLQSxJQUFJdUMsT0FBSixDQUFZLFNBQVosRUFBdUIsV0FBdkIsRUFBb0NDLE1BQXBDLFFBQWdEdEMsTUFBaEQsVUFBMkRrQyxPQUEzRCxXQUFQLEVBQW1GSCxNQUFNRSxTQUFTbkMsR0FBVCxFQUFjRSxNQUFkLEVBQXNCa0MsT0FBdEIsQ0FBekYsRUFBUDtBQUNIOztBQUVELFNBQVNoQyxlQUFULENBQXlCVSxJQUF6QixFQUErQjtBQUMzQixRQUFJb0MsSUFBSXpELFFBQVEwRCxJQUFSLENBQWFyQyxLQUFLYixJQUFsQixDQUFSO0FBQ0EsV0FBT1QsRUFBRWlFLEtBQUYsQ0FBUSxDQUFSLEVBQVlQLEVBQUUsTUFBRixFQUFVUSxNQUFWLENBQWlCLFlBQVc7QUFDM0MsZUFBT1IsRUFBRSxJQUFGLEVBQVFTLElBQVIsbUJBQTZCN0MsS0FBS1EsSUFBTCxDQUFVLENBQVYsQ0FBcEM7QUFDSCxLQUZrQixFQUVoQnNDLE9BRmdCLENBRVIsSUFGUSxFQUVGQyxRQUZFLENBRU8sSUFGUCxFQUVhQyxRQUZiLENBRXNCLElBRnRCLEVBRTRCQyxNQUY3QixHQUV1QyxDQUZ2QyxJQUU0QyxDQUZ2RCxFQUUwRCxDQUYxRCxDQUFQO0FBR0g7Ozs7Ozs7O2tDQXBGUWhFLFk7O2tDQXVCQWEsVzs7a0NBSUF1QixROztrQ0FJQXhCLFc7O2tDQVVBRCxhOztrQ0FpQkFELGE7O2tDQVVBRCxZOztrQ0FPQUYsYzs7a0NBSUFGLGUiLCJmaWxlIjoiY2hlZXJpby1yeC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBSeCA9IHJlcXVpcmUoJ3J4Jyk7XG52YXIgUnhOb2RlID0gcmVxdWlyZSgncngtbm9kZScpO1xudmFyIHJlcXVlc3QgPSByZXF1aXJlKCdyZXF1ZXN0Jyk7XG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xudmFyIGNoZWVyaW8gPSByZXF1aXJlKCdjaGVlcmlvJyk7XG5cbmV4cG9ydHMuZ2V0UmVzdWx0ID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICB2YXIgcmVzdWx0ID0gJyc7XG4gICAgZmV0Y2hDb250ZW50KHtcbiAgICAgICAgICAgIHVybDogcmVxLmJvZHkudXJsXG4gICAgICAgIH0sIHJlcS5ib2R5LnNlYXNvbilcbiAgICAgICAgLmZsYXRNYXAoZ2V0RXBpc29kZVJhbmdlKVxuICAgICAgICAubWFwKGZvcm1FcGlzb2RlVXJsLmJpbmQobnVsbCwgcmVxLmJvZHkudXJsLCByZXEuYm9keS5zZWFzb24pKVxuICAgICAgICAuZmxhdE1hcChkb3dubG9hZEh0bWwpXG4gICAgICAgIC5tYXAoZ2V0R29yaWxsYVVybClcbiAgICAgICAgLmZsYXRNYXAocG9zdFRvR29yaWxsYSlcbiAgICAgICAgLm1hcChnZXRWaWRlb1VybClcbiAgICAgICAgLmZsYXRNYXAocHJlcGFyZUh0bWwpXG4gICAgICAgIC5zdWJzY3JpYmUoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgcmVzdWx0ICs9IGRhdGE7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICByZXMuc2VuZChKU09OLnN0cmluZ2lmeShlcnJvcikpXG4gICAgICAgIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmVzLnNlbmQocmVzdWx0KTtcbiAgICAgICAgfSk7XG59XG5cblxuZnVuY3Rpb24gZmV0Y2hDb250ZW50KHBhcmFtcykge1xuICAgIGNvbnNvbGUubG9nKHBhcmFtcy51cmwpO1xuICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgcmV0dXJuIFJ4Lk9ic2VydmFibGUuY3JlYXRlKGZ1bmN0aW9uKG9ic2VydmVyKSB7XG4gICAgICAgIHJlcXVlc3QocGFyYW1zLCBmdW5jdGlvbihlcnJvciwgcmVzcG9uc2UsIGJvZHkpIHtcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgIG9ic2VydmVyLm9uRXJyb3IoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2Uuc3RhdHVzQ29kZSA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIub25OZXh0KHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogcGFyYW1zLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLFxuICAgICAgICAgICAgICAgICAgICBib2R5LFxuICAgICAgICAgICAgICAgICAgICBhcmdzXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIub25FcnJvcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb2JzZXJ2ZXIub25Db21wbGV0ZWQoKTtcbiAgICAgICAgfSlcbiAgICB9KTtcbn07XG5cbmZ1bmN0aW9uIHByZXBhcmVIdG1sKHsgdXJsLCBuYW1lIH0pIHtcbiAgICByZXR1cm4gYDxhIGhyZWY9JHt1cmx9PiR7bmFtZX08L2E+PGJyPmA7XG59XG5cbmZ1bmN0aW9uIGZpbGVOYW1lKHVybCwgc2Vhc29uLCBlcGlzb2RlKSB7XG4gICAgcmV0dXJuIF8ubGFzdCh1cmwuc3BsaXQoJy8nKSkucmVwbGFjZSgnXycsICcgJykuY29uY2F0KCcgUycgKyAoJzAnICsgKHNlYXNvbiArICcnKSkuc2xpY2UoLTIpICsgJ0UnICsgKCcwJyArIChlcGlzb2RlICsgJycpKS5zbGljZSgtMikpXG59XG5cbmZ1bmN0aW9uIGdldFZpZGVvVXJsKGRhdGEpIHtcbiAgICB2YXIgcGF0dGVybiA9IC9cImh0dHAoLiopKFxcLmZsdnxcXC5ta3Z8XFwubXA0KVwiLztcbiAgICB2YXIgbWF0Y2hlcyA9IHBhdHRlcm4uZXhlYyhkYXRhLmJvZHkpO1xuICAgIGlmIChtYXRjaGVzICYmIG1hdGNoZXNbMF0pIHtcbiAgICAgICAgcmV0dXJuIHsgdXJsOiBtYXRjaGVzWzBdLCBuYW1lOiBkYXRhLm5hbWUgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gcG9zdFRvR29yaWxsYSh7IHVybCwgbmFtZSB9KSB7XG4gICAgdmFyIHBhcmFtcyA9IHtcbiAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcsXG4gICAgICAgIH0sXG4gICAgICAgIGZvcm06IHtcbiAgICAgICAgICAgIG9wOiAnZG93bmxvYWQxJyxcbiAgICAgICAgICAgIG1ldGhvZF9mcmVlOiAnRnJlZStEb3dubG9hZCcsXG4gICAgICAgICAgICBpZDogXy5sYXN0KHVybC5zcGxpdCgnLycpKSxcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmV0Y2hDb250ZW50KHBhcmFtcylcbn1cblxuZnVuY3Rpb24gZ2V0R29yaWxsYVVybChkYXRhKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgdmFyICQgPSBjaGVlcmlvLmxvYWQoZGF0YS5ib2R5KTtcbiAgICAgICAgdmFyIHVybCA9ICQoJ2FbdGl0bGU9XCJnb3JpbGxhdmlkLmluXCJdJykuZmlyc3QoKS5hdHRyKCdocmVmJykuc3BsaXQoJz0nKVsxXVxuICAgICAgICByZXR1cm4geyB1cmw6IG5ldyBCdWZmZXIodXJsLCAnYmFzZTY0JykudG9TdHJpbmcoJ2FzY2lpJyksIG5hbWU6IGRhdGEubmFtZSB9O1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBSeC5PYnNlcnZhYmxlLmp1c3QobnVsbCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkb3dubG9hZEh0bWwoeyB1cmwsIG5hbWUgfSkge1xuICAgIHJldHVybiBmZXRjaENvbnRlbnQoe1xuICAgICAgICB1cmwsXG4gICAgICAgIG5hbWVcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gZm9ybUVwaXNvZGVVcmwodXJsLCBzZWFzb24sIGVwaXNvZGUpIHtcbiAgICByZXR1cm4geyB1cmw6IHVybC5yZXBsYWNlKCcvc2VyaWUvJywgJy9lcGlzb2RlLycpLmNvbmNhdChgX3Mke3NlYXNvbn1fZSR7ZXBpc29kZX0uaHRtbGApLCBuYW1lOiBmaWxlTmFtZSh1cmwsIHNlYXNvbiwgZXBpc29kZSkgfTtcbn1cblxuZnVuY3Rpb24gZ2V0RXBpc29kZVJhbmdlKGRhdGEpIHtcbiAgICB2YXIgJCA9IGNoZWVyaW8ubG9hZChkYXRhLmJvZHkpO1xuICAgIHJldHVybiBfLnJhbmdlKDEsICgkKCdzcGFuJykuZmlsdGVyKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJCh0aGlzKS50ZXh0KCkgPT09IGBTZWFzb24gJHtkYXRhLmFyZ3NbMF19YDtcbiAgICB9KS5wYXJlbnRzKCdoMicpLnNpYmxpbmdzKCd1bCcpLmNoaWxkcmVuKCdsaScpLmxlbmd0aCkgKyAxIHx8IDAsIDEpO1xufSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==