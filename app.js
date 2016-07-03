var express = require('express');
var cheerio = require('./cheerio');
var bodyParser = require('body-parser')
var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


app.post('/getUrls', function (req, res) {
    console.log(req);
    cheerio.getResult(req.body.url, req.body.season).then(function (response) {
        res.send(response);
    }, function (error) {
        res.status(500).send(error);
    });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
