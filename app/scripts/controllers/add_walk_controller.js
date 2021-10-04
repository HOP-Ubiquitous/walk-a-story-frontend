'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.controller('addWalkCtrl', [ 'rootService', 'userServiceData', 'walkService', '$filter', 'locationService', 'locationServiceData',
  function (rootService, userServiceData, walkService, $filter, locationService, locationServiceData) {

  var vm = this;
  vm.rootService = rootService;
  vm.walkService = walkService;
  vm.walk = {};

  vm.getUser = function () {
    return userServiceData.users;
  };

    locationService.getCities();

    vm.getCitiesList = function() {
      vm.citiesList = locationServiceData.citiesList;

      vm.citiesList.forEach(function (city, index) {
        if (city.points_of_interest.length === 0) {
          vm.citiesList.splice(index, 1);
        }
      });

      return vm.citiesList;
    };
    vm.getCitiesList();

    vm.updatePois = function () {
      vm.citiesList.forEach(function (city) {
        if (city.id === vm.walk.city) {
          vm.poiList = city.points_of_interest;
        }
      });
    };

  vm.sendWalk = function () {

    vm.date = $filter('date')(vm.walk.date, 'yyyy-MM-dd');
    vm.hour = $filter('date')(vm.walk.hour, 'HH:mm:ss.sssZ');
    vm.dateComposed = vm.date + 'T' + vm.hour;
    vm.utcDate = new Date(vm.dateComposed).toUTCString();

    vm.file = document.forms['add-walk']['walk-image'].files[0];

    var formData = new FormData();
    formData.append('file', vm.file);
    var latitude = '';
    var longitude = '';
    var poiName = '';
    var poiId = '';

    vm.poiList.forEach(function (poi) {
      if (vm.walk.poi === poi.id) {
        latitude = poi.latitude;
        longitude = poi.longitude;
        poiName = poi.name;
        poiId = poi.id;
      }
    });

    var walkEvent = {
      title: vm.walk.title,
      description: vm.walk.description,
      date: vm.utcDate,
      image: '',
      place_id: poiId,
      address: poiName,
      coordinates: {
        latitude: latitude,
        longitude: longitude
      },
      user: {
        id: userServiceData.users.id
      },
      participants: []
    };

    walkService.uploadingWalk = true;
    walkService.addWalkImage(formData, walkEvent);
    console.log(walkEvent);
  }


}]);
