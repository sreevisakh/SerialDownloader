'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var cheerio = require('./cheerio-rx');
var bodyParser = require('body-parser');

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

// parse application/json
app.use(bodyParser.json());

(0, _router2.default)(app);

app.use(express.static(_path2.default.resolve(__dirname, '../client')));

var port = process.env.PORT || 3000;

app.get('/', function (req, res) {
    console.log('/');
    res.sendFile(_path2.default.resolve(__dirname, 'client/index.html'));
});

app.get('/data.html', function (req, res) {
    res.sendFile(__dirname + '/data.html');
});

app.post('/getUrls', function (req, res) {
    console.log(req);
    return cheerio.getResult(req, res);
});
app.listen(port, function () {
    return console.log('Serial Downloader Listening on ' + port + '!');
});
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(app, 'app', '/home/sv/projects/utils/SerialKiller/src/server/app.js');

    __REACT_HOT_LOADER__.register(port, 'port', '/home/sv/projects/utils/SerialKiller/src/server/app.js');
}();

;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJleHByZXNzIiwicmVxdWlyZSIsImNoZWVyaW8iLCJib2R5UGFyc2VyIiwiYXBwIiwidXNlIiwidXJsZW5jb2RlZCIsImV4dGVuZGVkIiwianNvbiIsInN0YXRpYyIsInJlc29sdmUiLCJfX2Rpcm5hbWUiLCJwb3J0IiwicHJvY2VzcyIsImVudiIsIlBPUlQiLCJnZXQiLCJyZXEiLCJyZXMiLCJjb25zb2xlIiwibG9nIiwic2VuZEZpbGUiLCJwb3N0IiwiZ2V0UmVzdWx0IiwibGlzdGVuIl0sIm1hcHBpbmdzIjoiOztBQUdBOzs7O0FBQ0E7Ozs7OztBQUpBLElBQUlBLFVBQVVDLFFBQVEsU0FBUixDQUFkO0FBQ0EsSUFBSUMsVUFBVUQsUUFBUSxjQUFSLENBQWQ7QUFDQSxJQUFJRSxhQUFhRixRQUFRLGFBQVIsQ0FBakI7O0FBR0EsSUFBSUcsTUFBTUosU0FBVjs7QUFFQTtBQUNBSSxJQUFJQyxHQUFKLENBQVFGLFdBQVdHLFVBQVgsQ0FBc0I7QUFDMUJDLGNBQVU7QUFEZ0IsQ0FBdEIsQ0FBUjs7QUFJQTtBQUNBSCxJQUFJQyxHQUFKLENBQVFGLFdBQVdLLElBQVgsRUFBUjs7QUFFQSxzQkFBT0osR0FBUDs7QUFFQUEsSUFBSUMsR0FBSixDQUFRTCxRQUFRUyxNQUFSLENBQWUsZUFBS0MsT0FBTCxDQUFhQyxTQUFiLEVBQXdCLFdBQXhCLENBQWYsQ0FBUjs7QUFFQSxJQUFJQyxPQUFPQyxRQUFRQyxHQUFSLENBQVlDLElBQVosSUFBb0IsSUFBL0I7O0FBSUFYLElBQUlZLEdBQUosQ0FBUSxHQUFSLEVBQWEsVUFBQ0MsR0FBRCxFQUFNQyxHQUFOLEVBQWM7QUFDdkJDLFlBQVFDLEdBQVIsQ0FBWSxHQUFaO0FBQ0FGLFFBQUlHLFFBQUosQ0FBYSxlQUFLWCxPQUFMLENBQWFDLFNBQWIsRUFBd0IsbUJBQXhCLENBQWI7QUFDSCxDQUhEOztBQUtBUCxJQUFJWSxHQUFKLENBQVEsWUFBUixFQUFzQixVQUFDQyxHQUFELEVBQU1DLEdBQU4sRUFBYztBQUNoQ0EsUUFBSUcsUUFBSixDQUFhVixZQUFZLFlBQXpCO0FBQ0gsQ0FGRDs7QUFJQVAsSUFBSWtCLElBQUosQ0FBUyxVQUFULEVBQXFCLFVBQUNMLEdBQUQsRUFBTUMsR0FBTixFQUFjO0FBQy9CQyxZQUFRQyxHQUFSLENBQVlILEdBQVo7QUFDQSxXQUFPZixRQUFRcUIsU0FBUixDQUFrQk4sR0FBbEIsRUFBdUJDLEdBQXZCLENBQVA7QUFDSCxDQUhEO0FBSUFkLElBQUlvQixNQUFKLENBQVdaLElBQVgsRUFBaUI7QUFBQSxXQUFNTyxRQUFRQyxHQUFSLHFDQUE4Q1IsSUFBOUMsT0FBTjtBQUFBLENBQWpCOzs7Ozs7OztrQ0EvQklSLEc7O2tDQWNBUSxJIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpO1xudmFyIGNoZWVyaW8gPSByZXF1aXJlKCcuL2NoZWVyaW8tcngnKTtcbnZhciBib2R5UGFyc2VyID0gcmVxdWlyZSgnYm9keS1wYXJzZXInKVxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgUm91dGVyIGZyb20gJy4vcm91dGVyJztcbnZhciBhcHAgPSBleHByZXNzKCk7XG5cbi8vIHBhcnNlIGFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFxuYXBwLnVzZShib2R5UGFyc2VyLnVybGVuY29kZWQoe1xuICAgIGV4dGVuZGVkOiBmYWxzZVxufSkpXG5cbi8vIHBhcnNlIGFwcGxpY2F0aW9uL2pzb25cbmFwcC51c2UoYm9keVBhcnNlci5qc29uKCkpXG5cblJvdXRlcihhcHApO1xuXG5hcHAudXNlKGV4cHJlc3Muc3RhdGljKHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLi9jbGllbnQnKSkpO1xuXG52YXIgcG9ydCA9IHByb2Nlc3MuZW52LlBPUlQgfHwgMzAwMDtcblxuXG5cbmFwcC5nZXQoJy8nLCAocmVxLCByZXMpID0+IHtcbiAgICBjb25zb2xlLmxvZygnLycpO1xuICAgIHJlcy5zZW5kRmlsZShwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnY2xpZW50L2luZGV4Lmh0bWwnKSk7XG59KTtcblxuYXBwLmdldCgnL2RhdGEuaHRtbCcsIChyZXEsIHJlcykgPT4ge1xuICAgIHJlcy5zZW5kRmlsZShfX2Rpcm5hbWUgKyAnL2RhdGEuaHRtbCcpO1xufSk7XG5cbmFwcC5wb3N0KCcvZ2V0VXJscycsIChyZXEsIHJlcykgPT4ge1xuICAgIGNvbnNvbGUubG9nKHJlcSk7XG4gICAgcmV0dXJuIGNoZWVyaW8uZ2V0UmVzdWx0KHJlcSwgcmVzKTtcbn0pO1xuYXBwLmxpc3Rlbihwb3J0LCAoKSA9PiBjb25zb2xlLmxvZyhgU2VyaWFsIERvd25sb2FkZXIgTGlzdGVuaW5nIG9uICR7cG9ydH0hYCkpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==