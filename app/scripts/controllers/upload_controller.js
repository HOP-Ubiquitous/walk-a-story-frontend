'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.controller('uploadCtrl',[ 'rootService', '$scope', '$sce', 'videoService', 'userServiceData', '$timeout', 'LOCATION_DEFAULT', '$routeParams', 'locationService', 'locationServiceData', '$location',
  function(rootService, $scope, $sce, videoService, userServiceData, $timeout, LOCATION_DEFAULT, $routeParams, locationService, locationServiceData, $location) {

  var vm = this;
  vm.rootService = rootService;
  vm.videoService = videoService;

  var video = document.getElementById("preview");
  var input = document.querySelector('input[type=file]');

  vm.inputImage = true;
  vm.newVideo = {};

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
      if (city.id === vm.newVideo.city) {
       vm.poiList = city.points_of_interest;
      }
    });
  };

  $scope.getVideoFromInput = function () {
    if (input.files && input.files[0]) {
      vm.inputImage = false;
      vm.file = input.files[0];
      vm.video = URL.createObjectURL(vm.file);
      var reader = new FileReader();
      reader.onload = function() {
        video.src = vm.video;
      };
      reader.readAsDataURL(vm.file);
    }
  };

  vm.sendVideo = function () {

    vm.openMessageWindow = false;

    if(vm.newVideo.point !== null && vm.file !== undefined && vm.newVideo.terms === true && vm.newVideo.title !== undefined) {

      var videoFile = vm.file;
      var latitude = '';
      var longitude = '';
      var poiId = '';

      vm.poiList.forEach(function (poi) {
        if (vm.newVideo.poi === poi.id) {
          latitude = poi.latitude;
          longitude = poi.longitude;
          poiId = poi.id;
        }
      });

      var newVideo = {
        name: userServiceData.users.name,
        mail: userServiceData.users.email,
        videoId: '',
        title: vm.newVideo.title,
        description: vm.newVideo.description,
        user_id: userServiceData.users.id,
        place_id: poiId,
        coordinates: {
          latitude: latitude,
          longitude: longitude
        }
      };

      var formData = new FormData();
      formData.append('file', vm.file);

      videoService.uploadingVideo = true;
      videoService.uploadVideo(formData, newVideo.place_id, newVideo);

      console.log(videoFile);
      console.log(newVideo);

      vm.successMessage = 'The video has been sent successfully!';
      vm.openMessageWindow = true;
      vm.successUpload = true;

      $timeout(function quitPopup() {
        vm.openMessageWindow = false;
      });

    } else {
      vm.successMessage = 'You must fill all the required fields!';
      vm.openMessageWindow = true;
      vm.successUpload = false;

      $timeout(function quitPopup() {
        vm.openMessageWindow = false;
      });

    }

  };

  vm.goToTerms = function () {
    $location.path($routeParams.language + '/terms');
  };

  function initWatchers() {

    vm.requestError = $scope.$watch(
      function () {
        return videoService.uploadError;
      }, function (newValue) {
        if (newValue === true) {

          vm.successMessage = videoService.errorMessage[0].toUpperCase() + videoService.errorMessage.slice(1).toLowerCase();
          vm.openMessageWindow = true;
          vm.successUpload = false;

          $timeout(function quitPopup() {
            vm.openMessageWindow = false;
          });

          videoService.uploadError = false;
        }
      }
    );

  }
  initWatchers();

}]);
