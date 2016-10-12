var express = require('express');
var cheerio = require('./cheerio-rx');
var bodyParser = require('body-parser')
import path from 'path';
import Router from './router';
var app = express();

Router(app);

app.use(express.static(path.resolve(__dirname, '../client')));

var port = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
    console.log('/');
    res.sendFile(path.resolve(__dirname, 'client/index.html'));
});

app.get('/data.html', (req, res) => {
    res.sendFile(__dirname + '/data.html');
});

app.post('/getUrls', (req, res) => {
    console.log(req);
    return cheerio.getResult(req, res);
});
app.listen(port, () => console.log(`Serial Downloader Listening on ${port}!`));