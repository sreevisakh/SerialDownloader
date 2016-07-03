import Rx from 'rx';
import RxNode from 'rx-node';
import request from 'request';

var fetchContent = url => {
    return Rx.Observable.create(observer => {
        request(url, (error, response, body => {
            if (error) {
                observer.onError();
            } else {
                observer.onNext({
                    response,
                    body
                });
                observer.onCompleted();
            }
        }));
    });
};

var observer = Rx.Observer.create(function (x) {
    console.log('Next: %s', x);
}, function (err) {
    console.log('Error: %s', err);
}, function () {
    console.log('Completed');
});

var subscription = fetchContent('http://thewatchseries.to/serie/the_flash_2014_').subscribe(observer);
//# sourceMappingURL=rx.js.map