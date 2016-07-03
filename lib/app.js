'use strict';

var express = require('express');
var cheerio = require('./cheerio-rx');
var bodyParser = require('body-parser');
var app = express();

var port = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

// parse application/json
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/data.html', function (req, res) {
    res.sendFile(__dirname + '/data.html');
});

app.post('/getUrls', function (req, res) {
    console.log(req);
    cheerio.getResult(req.body.url, req.body.season).then(function (response) {
        return res.send(response);
    }, function (error) {
        return res.status(500).send(error);
    });
});

app.listen(port, function () {
    return console.log('Serial Downloader Listening on ' + port + '!');
});
//# sourceMappingURL=app.js.map