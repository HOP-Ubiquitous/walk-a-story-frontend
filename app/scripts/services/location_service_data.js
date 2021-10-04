'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.service('locationServiceData', [ function() {

  var locationService = {};

  locationService.citiesList = [];
  locationService.cityListById = [];
  locationService.cityListByPoiId = [];
  locationService.poisList = [];
  locationService.poisListById = [];

  return locationService;

}]);
