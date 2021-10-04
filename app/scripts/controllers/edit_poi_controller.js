'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.controller('editPoiCtrl', [ 'rootService', 'userServiceData', 'locationService', 'locationServiceData', '$routeParams',
  function (rootService, userServiceData, locationService, locationServiceData, $routeParams) {

    var vm = this;

    vm.place = {};
    vm.locationService = locationService;
    vm.rootService = rootService;

    vm.getUser = function () {
      return userServiceData.users;
    };

    vm.getCitiesList = function() {
      vm.citiesList = locationServiceData.citiesList;
      return vm.citiesList;
    };
    vm.getCitiesList();

    vm.citiesList.forEach(function (city) {
      if (city.id === $routeParams.place_id) {
        city.points_of_interest.forEach(function (poi) {
          if (poi.id === $routeParams.poi_id) {
            vm.place.poi_name = poi.name;
            vm.place.poi_latitude = Number(poi.latitude);
            vm.place.poi_longitude = Number(poi.longitude);
          }
        });
      }
    });

    vm.editPoi = function () {

      var poi = {
        name: vm.place.poi_name,
        city_id: $routeParams.place_id,
        latitude: vm.place.poi_latitude,
        longitude: vm.place.poi_longitude
      };

      vm.locationService.updatePoi(poi, $routeParams.poi_id);

    };


  }]);
