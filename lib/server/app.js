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

(0, _router2.default)(app);

app.use(express.static(_path2.default.resolve(__dirname, '../client')));

var port = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

// parse application/json
app.use(bodyParser.json());

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
//# sourceMappingURL=app.js.map
