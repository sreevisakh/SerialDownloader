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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhY2hlLmpzIl0sIm5hbWVzIjpbImNsaWVudCIsImNyZWF0ZUNsaWVudCIsIm9uIiwiZXJyIiwiY29uc29sZSIsImxvZyIsImdldCIsImtleSIsImNiIiwic2V0IiwidmFsdWUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7QUFDQTtBQUNBLElBQUlBLFNBQVMsZ0JBQU1DLFlBQU4sRUFBYjs7QUFFQUQsT0FBT0UsRUFBUCxDQUFVLE9BQVYsRUFBbUIsVUFBU0MsR0FBVCxFQUFjO0FBQzdCQyxZQUFRQyxHQUFSLENBQVksV0FBV0YsR0FBdkI7QUFDSCxDQUZEOztBQUlBLFNBQVNHLEdBQVQsQ0FBYUMsR0FBYixFQUFrQkMsRUFBbEIsRUFBc0I7QUFDbEIsV0FBT1IsT0FBT00sR0FBUCxDQUFXQyxHQUFYLEVBQWdCQyxFQUFoQixDQUFQO0FBQ0g7O0FBRUQsU0FBU0MsR0FBVCxDQUFhRixHQUFiLEVBQWtCRyxLQUFsQixFQUF5QkYsRUFBekIsRUFBNkI7QUFDekIsV0FBT1IsT0FBT1MsR0FBUCxDQUFXRixHQUFYLEVBQWdCRyxLQUFoQixFQUF1QkYsRUFBdkIsQ0FBUDtBQUNIO2tCQUNjO0FBQ1hGLFlBRFc7QUFFWEc7QUFGVyxDIiwiZmlsZSI6ImNhY2hlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHJlZGlzIGZyb20gJ3JlZGlzJztcbi8vIHJlZGlzLmRlYnVnX21vZGUgPSB0cnVlO1xubGV0IGNsaWVudCA9IHJlZGlzLmNyZWF0ZUNsaWVudCgpO1xuXG5jbGllbnQub24oXCJlcnJvclwiLCBmdW5jdGlvbihlcnIpIHtcbiAgICBjb25zb2xlLmxvZyhcIkVycm9yIFwiICsgZXJyKTtcbn0pO1xuXG5mdW5jdGlvbiBnZXQoa2V5LCBjYikge1xuICAgIHJldHVybiBjbGllbnQuZ2V0KGtleSwgY2IpO1xufVxuXG5mdW5jdGlvbiBzZXQoa2V5LCB2YWx1ZSwgY2IpIHtcbiAgICByZXR1cm4gY2xpZW50LnNldChrZXksIHZhbHVlLCBjYik7XG59XG5leHBvcnQgZGVmYXVsdCB7XG4gICAgZ2V0LFxuICAgIHNldFxufSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
