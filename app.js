var express = require('express');
var cheerio = require('./cheerio');
var bodyParser = require('body-parser')
var app = express();

var port = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

// parse application/json
app.use(bodyParser.json())

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});


app.post('/getUrls', (req, res) => {
    console.log(req);
    cheerio.getResult(req.body.url, req.body.season)
        .then(
            response => res.send(response),
            error => res.status(500).send(error)
        );
});

app.listen(port, () => console.log(`Serial Downloader Listening on ${port}!`));