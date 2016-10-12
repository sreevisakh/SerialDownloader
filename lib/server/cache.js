"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _redis = require("redis");

var _redis2 = _interopRequireDefault(_redis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// redis.debug_mode = true;
var client = _redis2.default.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});

function get(key, cb) {
    return client.get(key, cb);
}

function set(key, value, cb) {
    return client.set(key, value, cb);
}
exports.default = {
    get: get,
    set: set
};
//# sourceMappingURL=cache.js.map
