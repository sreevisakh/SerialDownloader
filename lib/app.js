'use strict';

var express = require('express');
var cheerio = require('./cheerio');
var bodyParser = require('body-parser');
var app = express();

var port = process.env.PORT || 9615;

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
    return cheerio.getResult(req, res);
});

app.listen(port, function () {
    return console.log('Serial Downloader Listening on ' + port + '!');
});