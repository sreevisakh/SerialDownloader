'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bluebird2.default.promisifyAll(_redis2.default.RedisClient.prototype);
var client = _redis2.default.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});

function get(key) {
    console.log('Cache : Get : ' + key);
    return client.getAsync(key);
}

function set(key, value) {
    console.log('Cache : Set : ' + key);
    return client.setAsync(key, value);
}
var _default = {
    get: get,
    set: set
};
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(client, 'client', '/home/sv/projects/utils/SerialKiller/src/server/cache.js');

    __REACT_HOT_LOADER__.register(get, 'get', '/home/sv/projects/utils/SerialKiller/src/server/cache.js');

    __REACT_HOT_LOADER__.register(set, 'set', '/home/sv/projects/utils/SerialKiller/src/server/cache.js');

    __REACT_HOT_LOADER__.register(_default, 'default', '/home/sv/projects/utils/SerialKiller/src/server/cache.js');
}();

;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhY2hlLmpzIl0sIm5hbWVzIjpbInByb21pc2lmeUFsbCIsIlJlZGlzQ2xpZW50IiwicHJvdG90eXBlIiwiY2xpZW50IiwiY3JlYXRlQ2xpZW50Iiwib24iLCJlcnIiLCJjb25zb2xlIiwibG9nIiwiZ2V0Iiwia2V5IiwiZ2V0QXN5bmMiLCJzZXQiLCJ2YWx1ZSIsInNldEFzeW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFDQSxtQkFBU0EsWUFBVCxDQUFzQixnQkFBTUMsV0FBTixDQUFrQkMsU0FBeEM7QUFDQSxJQUFJQyxTQUFTLGdCQUFNQyxZQUFOLEVBQWI7O0FBRUFELE9BQU9FLEVBQVAsQ0FBVSxPQUFWLEVBQW1CLFVBQVNDLEdBQVQsRUFBYztBQUM3QkMsWUFBUUMsR0FBUixDQUFZLFdBQVdGLEdBQXZCO0FBQ0gsQ0FGRDs7QUFJQSxTQUFTRyxHQUFULENBQWFDLEdBQWIsRUFBa0I7QUFDZEgsWUFBUUMsR0FBUixDQUFZLG1CQUFtQkUsR0FBL0I7QUFDQSxXQUFPUCxPQUFPUSxRQUFQLENBQWdCRCxHQUFoQixDQUFQO0FBQ0g7O0FBRUQsU0FBU0UsR0FBVCxDQUFhRixHQUFiLEVBQWtCRyxLQUFsQixFQUF5QjtBQUNyQk4sWUFBUUMsR0FBUixDQUFZLG1CQUFtQkUsR0FBL0I7QUFDQSxXQUFPUCxPQUFPVyxRQUFQLENBQWdCSixHQUFoQixFQUFxQkcsS0FBckIsQ0FBUDtBQUNIO2VBQ2M7QUFDWEosWUFEVztBQUVYRztBQUZXLEM7Ozs7Ozs7OztrQ0FmWFQsTTs7a0NBTUtNLEc7O2tDQUtBRyxHIiwiZmlsZSI6ImNhY2hlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHJlZGlzIGZyb20gJ3JlZGlzJztcbmltcG9ydCBibHVlYmlyZCBmcm9tICdibHVlYmlyZCc7XG5ibHVlYmlyZC5wcm9taXNpZnlBbGwocmVkaXMuUmVkaXNDbGllbnQucHJvdG90eXBlKTtcbmxldCBjbGllbnQgPSByZWRpcy5jcmVhdGVDbGllbnQoKTtcblxuY2xpZW50Lm9uKFwiZXJyb3JcIiwgZnVuY3Rpb24oZXJyKSB7XG4gICAgY29uc29sZS5sb2coXCJFcnJvciBcIiArIGVycik7XG59KTtcblxuZnVuY3Rpb24gZ2V0KGtleSkge1xuICAgIGNvbnNvbGUubG9nKCdDYWNoZSA6IEdldCA6ICcgKyBrZXkpXG4gICAgcmV0dXJuIGNsaWVudC5nZXRBc3luYyhrZXkpO1xufVxuXG5mdW5jdGlvbiBzZXQoa2V5LCB2YWx1ZSkge1xuICAgIGNvbnNvbGUubG9nKCdDYWNoZSA6IFNldCA6ICcgKyBrZXkpXG4gICAgcmV0dXJuIGNsaWVudC5zZXRBc3luYyhrZXksIHZhbHVlKTtcbn1cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBnZXQsXG4gICAgc2V0XG59Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
