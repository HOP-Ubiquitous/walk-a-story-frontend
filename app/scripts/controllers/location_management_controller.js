'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.controller('locationManagementCtrl',
  [ 'rootService', '$location', 'userService', 'userServiceData','locationService', 'locationServiceData', '$routeParams', '$scope',
    function (rootService, $location, userService, userServiceData, locationService, locationServiceData, $routeParams, $scope) {

      var vm = this;
      vm.showPoi = [];
      vm.place = {};
      vm.poi = {};
      vm.locationServiceData = locationServiceData;
      vm.rootService = rootService;
      vm.userServiceData = userServiceData;

      locationService.getCities();

      vm.getCitiesList = function() {
        vm.citiesList = locationServiceData.citiesList;
        return vm.citiesList;
      };
      vm.getCitiesList();

      vm.getPoiByIndex = function (index, showBoolean) {
        vm.pois = vm.citiesList[index].points_of_interest;

        vm.showPoi = [];
        vm.pois.forEach(function () {
          vm.showPoi.push(false);
        });

        if (showBoolean === true) {
          vm.showPoi[index] = false;
        } else {
          vm.showPoi[index] = true;
        }

        return vm.pois;
      };

      vm.deleteCity = function (city_id) {
        locationService.deleteCity(city_id);
      };

      vm.deletePoi = function (poi_id) {
        locationService.deletePoi(poi_id);
      };

      vm.addCity = function () {
        $location.path('/'+ $routeParams.language + '/location_management/add_place');
      };

      vm.editPlace = function (city_id) {
        $routeParams.place_id = city_id;
        $location.path('/'+ $routeParams.language + '/location_management/' + $routeParams.place_id + '/edit_place');
      };

      vm.addPoint = function (city_id) {
        $routeParams.place_id = city_id;
        $location.path('/'+ $routeParams.language + '/location_management/' + $routeParams.place_id + '/add_poi');
      };

      vm.editPoi = function (city_id, poi_id) {
        $routeParams.place_id = city_id;
        $routeParams.poi_id = poi_id;
        $location.path('/'+ $routeParams.language + '/location_management/' + $routeParams.place_id + '/' + $routeParams.poi_id +'/edit_poi');
      };

      vm.backToLocation = function () {
        $location.path('/'+ $routeParams.language + '/location_management/');
      };

      function initWatchers() {
        vm.updateList = $scope.$watch(
          function () {
            return locationService.updatedCity;
          }, function (newValue) {

            if (newValue === true) {
              locationServiceData.citiesList = [];
              locationService.getCities();
              locationService.updatedCity = false;
            }
          }
        );

        vm.reloadCities = $scope.$watch(
          function () {
            return locationService.reloadCities;
          }, function (newValue) {

            if (newValue === true) {
              vm.getCitiesList();
              locationService.reloadCities = false;
            }
          }
        );

      }
      initWatchers();
    }]);
