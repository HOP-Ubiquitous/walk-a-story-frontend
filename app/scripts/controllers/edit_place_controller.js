'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.controller('editPlaceCtrl', [ 'rootService', 'userServiceData', 'locationService', 'locationServiceData', '$routeParams',
  function (rootService, userServiceData, locationService, locationServiceData, $routeParams) {

    var vm = this;

    vm.place = {};
    vm.locationService = locationService;
    vm.locationServiceData = locationServiceData;
    vm.rootService = rootService;

    locationService.getCities();

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
        vm.place.city_name = city.name;
      }
    });

    vm.editCity = function () {
      var city = {
        name: vm.place.city_name,
      };

      locationService.updateCity(city, $routeParams.place_id);

    };


  }]);
