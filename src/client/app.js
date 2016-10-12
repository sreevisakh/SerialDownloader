import 'babel-polyfill';
import angular from 'angular';

import SearchController from './search/search.controller';
import SerialService from './serial.service';

let app = angular.module('SerialApp', [])

app.service('SerialService', SerialService);
app.controller('SearchController', SearchController);