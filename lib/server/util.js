'use strict';

var lodash = require('lodash');

function findName(url) {
    var regex = /([a-zA-Z0-9_]*)(_s)/;
    var matches = url.match(regex);
    if (matches && matches[1]) {
        return matches[1].replace('_', ' ').toProperCase();
    }
    return "Serial";
}

function findSeason(url) {
    var regex = /_s([0-9])_/;
    var matches = url.match(regex);
    if (matches && matches[1]) {
        return parseInt(matches[1]);
    }
    return "0";
}

function getVideoId(url) {
    //only for gorillavid
    return url.split('/').pop();
}
String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

module.exports = {
    findName: findName,
    findSeason: findSeason,
    getVideoId: getVideoId
};
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(findName, 'findName', '/home/sv/projects/utils/SerialKiller/src/server/util.js');

    __REACT_HOT_LOADER__.register(findSeason, 'findSeason', '/home/sv/projects/utils/SerialKiller/src/server/util.js');

    __REACT_HOT_LOADER__.register(getVideoId, 'getVideoId', '/home/sv/projects/utils/SerialKiller/src/server/util.js');
}();

;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWwuanMiXSwibmFtZXMiOlsibG9kYXNoIiwicmVxdWlyZSIsImZpbmROYW1lIiwidXJsIiwicmVnZXgiLCJtYXRjaGVzIiwibWF0Y2giLCJyZXBsYWNlIiwidG9Qcm9wZXJDYXNlIiwiZmluZFNlYXNvbiIsInBhcnNlSW50IiwiZ2V0VmlkZW9JZCIsInNwbGl0IiwicG9wIiwiU3RyaW5nIiwicHJvdG90eXBlIiwidHh0IiwiY2hhckF0IiwidG9VcHBlckNhc2UiLCJzdWJzdHIiLCJ0b0xvd2VyQ2FzZSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsU0FBU0MsUUFBUSxRQUFSLENBQWI7O0FBR0EsU0FBU0MsUUFBVCxDQUFrQkMsR0FBbEIsRUFBdUI7QUFDbkIsUUFBSUMsUUFBUSxxQkFBWjtBQUNBLFFBQUlDLFVBQVVGLElBQUlHLEtBQUosQ0FBVUYsS0FBVixDQUFkO0FBQ0EsUUFBSUMsV0FBV0EsUUFBUSxDQUFSLENBQWYsRUFBMkI7QUFDdkIsZUFBT0EsUUFBUSxDQUFSLEVBQVdFLE9BQVgsQ0FBbUIsR0FBbkIsRUFBd0IsR0FBeEIsRUFBNkJDLFlBQTdCLEVBQVA7QUFDSDtBQUNELFdBQU8sUUFBUDtBQUNIOztBQUVELFNBQVNDLFVBQVQsQ0FBb0JOLEdBQXBCLEVBQXlCO0FBQ3JCLFFBQUlDLFFBQVEsWUFBWjtBQUNBLFFBQUlDLFVBQVVGLElBQUlHLEtBQUosQ0FBVUYsS0FBVixDQUFkO0FBQ0EsUUFBSUMsV0FBV0EsUUFBUSxDQUFSLENBQWYsRUFBMkI7QUFDdkIsZUFBT0ssU0FBU0wsUUFBUSxDQUFSLENBQVQsQ0FBUDtBQUNIO0FBQ0QsV0FBTyxHQUFQO0FBQ0g7O0FBRUQsU0FBU00sVUFBVCxDQUFvQlIsR0FBcEIsRUFBeUI7QUFDckI7QUFDQSxXQUFPQSxJQUFJUyxLQUFKLENBQVUsR0FBVixFQUFlQyxHQUFmLEVBQVA7QUFDSDtBQUNEQyxPQUFPQyxTQUFQLENBQWlCUCxZQUFqQixHQUFnQyxZQUFZO0FBQ3hDLFdBQU8sS0FBS0QsT0FBTCxDQUFhLFFBQWIsRUFBdUIsVUFBVVMsR0FBVixFQUFlO0FBQ3pDLGVBQU9BLElBQUlDLE1BQUosQ0FBVyxDQUFYLEVBQWNDLFdBQWQsS0FBOEJGLElBQUlHLE1BQUosQ0FBVyxDQUFYLEVBQWNDLFdBQWQsRUFBckM7QUFDSCxLQUZNLENBQVA7QUFHSCxDQUpEOztBQU9BQyxPQUFPQyxPQUFQLEdBQWlCO0FBQ2JwQixjQUFVQSxRQURHO0FBRWJPLGdCQUFZQSxVQUZDO0FBR2JFLGdCQUFZQTtBQUhDLENBQWpCOzs7Ozs7OztrQ0E3QlNULFE7O2tDQVNBTyxVOztrQ0FTQUUsVSIsImZpbGUiOiJ1dGlsLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGxvZGFzaCA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG5cbmZ1bmN0aW9uIGZpbmROYW1lKHVybCkge1xuICAgIHZhciByZWdleCA9IC8oW2EtekEtWjAtOV9dKikoX3MpLztcbiAgICB2YXIgbWF0Y2hlcyA9IHVybC5tYXRjaChyZWdleCk7XG4gICAgaWYgKG1hdGNoZXMgJiYgbWF0Y2hlc1sxXSkge1xuICAgICAgICByZXR1cm4gbWF0Y2hlc1sxXS5yZXBsYWNlKCdfJywgJyAnKS50b1Byb3BlckNhc2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIFwiU2VyaWFsXCI7XG59XG5cbmZ1bmN0aW9uIGZpbmRTZWFzb24odXJsKSB7XG4gICAgdmFyIHJlZ2V4ID0gL19zKFswLTldKV8vO1xuICAgIHZhciBtYXRjaGVzID0gdXJsLm1hdGNoKHJlZ2V4KTtcbiAgICBpZiAobWF0Y2hlcyAmJiBtYXRjaGVzWzFdKSB7XG4gICAgICAgIHJldHVybiBwYXJzZUludChtYXRjaGVzWzFdKTtcbiAgICB9XG4gICAgcmV0dXJuIFwiMFwiO1xufVxuXG5mdW5jdGlvbiBnZXRWaWRlb0lkKHVybCkge1xuICAgIC8vb25seSBmb3IgZ29yaWxsYXZpZFxuICAgIHJldHVybiB1cmwuc3BsaXQoJy8nKS5wb3AoKTtcbn1cblN0cmluZy5wcm90b3R5cGUudG9Qcm9wZXJDYXNlID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnJlcGxhY2UoL1xcd1xcUyovZywgZnVuY3Rpb24gKHR4dCkge1xuICAgICAgICByZXR1cm4gdHh0LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdHh0LnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpO1xuICAgIH0pO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBmaW5kTmFtZTogZmluZE5hbWUsXG4gICAgZmluZFNlYXNvbjogZmluZFNlYXNvbixcbiAgICBnZXRWaWRlb0lkOiBnZXRWaWRlb0lkXG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
