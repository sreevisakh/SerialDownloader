import redis from 'redis';
import bluebird from 'bluebird';
bluebird.promisifyAll(redis.RedisClient.prototype);
let client = redis.createClient();

client.on("error", function(err) {
    console.log("Error " + err);
});

function get(key) {
    console.log('Cache : Get : ' + key)
    return client.getAsync(key);
}

function set(key, value) {
    console.log('Cache : Set : ' + key)
    return client.setAsync(key, value);
}
export default {
    get,
    set
}