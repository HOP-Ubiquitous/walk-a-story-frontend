'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.controller('profileLocationCtrl', ['rootService', '$location', 'userServiceData', 'videoService', 'videoServiceData', '$scope', '$routeParams', 'leafletMarkerEvents', 'LOCATION_DEFAULT',
  function (rootService, $location, userServiceData, videoService, videoServiceData, $scope, $routeParams, leafletMarkerEvents, LOCATION_DEFAULT) {

  var vm = this;

  vm.rootService = rootService;
  vm.userServiceData = userServiceData;
  vm.videoServiceData = videoServiceData;
  vm.locationDefault = LOCATION_DEFAULT;
  vm.locationLoaded = false;
  vm.headerTitle = '';

  function getUser() {
    return userServiceData.users;
  }
  getUser();

  videoService.getVideoListByUser(userServiceData.users.id);

  function getVideos() {
    return videoServiceData.videoListByUser;
  }

  vm.showedPoints = [];
  vm.markers = {};

  function getMapData() {

    vm.showedPoints = videoServiceData.videoListByUser.videos;

    vm.markers = {};
    if ($routeParams.video_id !== undefined) {
      vm.showedPoints.forEach(function (video, index) {
        if (video.id === $routeParams.video_id) {
          vm.latitude = Number(video.coordinates.latitude);
          vm.longitude = Number(video.coordinates.longitude);
          vm.zoom = 15;
        }

        vm.markers[index] = {
          // group: 'profile videos',
          lat: Number(video.coordinates.latitude),
          lng: Number(video.coordinates.longitude),
          data: video,
          icon: {
            iconUrl: '../../images/video_icon.svg',
            iconSize: [30, 50],
            iconAnchor: [15, 50]
          }
        };

      });
    }

    angular.extend($scope, {
      defaults: {
        tileLayer: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
        maxZoom: 17
      },
      center: {
        lat: vm.latitude,
        lng: vm.longitude,
        zoom: vm.zoom
      },
      markers: angular.copy(vm.markers),
      events: {
        markers: {
          enable: leafletMarkerEvents.getAvailableEvents()
        }
      }
    });
  }
  getMapData();

  function initWatchers() {

    if (videoServiceData.videoListByUser.videos.length === 0) {
      vm.videoWatcher = $scope.$watch(
        function () {
          return videoService.userVideosLoaded;
        }, function (newValue) {
          if (newValue === true) {
            getVideos();
            vm.locationLoaded = true;
            videoService.userVideosLoaded = false;
          }
        }
      );
    } else {
      vm.mapWatcher = $scope.$watch(
        function () {
          return vm.locationLoaded;
        }, function (newValue) {
          if (newValue === true) {
            getMapData();
            vm.locationLoaded = false;
          }
        }
      );
    }
  }

  initWatchers();

  var markerEvents = leafletMarkerEvents.getAvailableEvents();
  var eventName = markerEvents[0];
  $scope.$on('leafletDirectiveMarker.profile-map.' + eventName, function(event, args){
    vm.dataMarker = args.model.data;
    console.log(args);
  });

  vm.goToVideos = function () {
    $location.path('/' + $routeParams.language + '/profile');
  };

}]);
