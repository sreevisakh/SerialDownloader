import request from 'request-promise';
import * as w from 'winston';
import watchseries from './watchseries/index'

export default (app) => {

    app.get('/api/search', (req, res) => {
        console.log(req.query);
        let searchText = req.query.q;
        if (!searchText) {
            return res.send([]);
        } else {
            let options = {
                url: 'http://the-watch-series.to/show/search-shows-json',
                method: 'POST',
                form: {
                    term: searchText
                }
            }
            request(options).then(response => {
                return res.status(200).send(response);
            }, error => {
                w.error(error);
                return res.status(500).send(error);
            })
        }
    });
    app.get('/api/serial/:id', watchseries.getSerialDetails)
}