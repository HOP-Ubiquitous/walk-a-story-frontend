'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.controller('uploadVideoAnswerCtrl',[ 'rootService', '$scope', '$sce', 'localEcosystemService', 'videoService', 'videoServiceData', 'userServiceData', '$timeout', 'LOCATION_DEFAULT', '$routeParams', 'locationService', 'locationServiceData', '$location', 'localEcosystemServiceData',
  function(rootService, $scope, $sce, localEcosystemService, videoService, videoServiceData, userServiceData, $timeout, LOCATION_DEFAULT, $routeParams, locationService, locationServiceData, $location, localEcosystemServiceData) {

  var vm = this;
  vm.rootService = rootService;
  vm.videoService = videoService;
  vm.selectedVideo = videoServiceData.videoById;
  vm.localSelected = localEcosystemServiceData.localById;

  var video = document.getElementById("preview");
  var input = document.querySelector('input[type=file]');

  vm.inputImage = true;
  vm.newVideo = {};

  vm.getUser = function () {
    return userServiceData.users;
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

    if(vm.file !== undefined && vm.newVideo.terms === true && vm.newVideo.title !== undefined) {

      var videoFile = vm.file;

      var newVideo = {
        name: userServiceData.users.name,
        mail: userServiceData.users.email,
        videoId: '',
        title: vm.newVideo.title,
        description: vm.newVideo.description,
        user_id: userServiceData.users.id,
        place_id: localEcosystemServiceData.localById.id,
        coordinates: localEcosystemServiceData.localById.coordinates
      };

      var formData = new FormData();
      formData.append('file', vm.file);

      videoService.uploadingVideo = true;
      localEcosystemService.uploadVideoAnswer(formData, newVideo.place_id, newVideo);

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
