import redis from 'redis';
// redis.debug_mode = true;
let client = redis.createClient();

client.on("error", function(err) {
    console.log("Error " + err);
});

function get(key, cb) {
    return client.get(key, cb);
}

function set(key, value, cb) {
    return client.set(key, value, cb);
}
export default {
    get,
    set
}