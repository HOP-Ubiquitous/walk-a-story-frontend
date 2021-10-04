'use strict';

app.controller('videoLocationCtrl',
  ['rootService', '$location', 'userServiceData', 'videoService', 'videoServiceData', '$scope', '$routeParams', 'leafletMarkerEvents', 'leafletData', 'leafletBoundsHelpers', 'LOCATION_DEFAULT',
    function (rootService, $location, userServiceData, videoService, videoServiceData, $scope, $routeParams, leafletMarkerEvents, leafletData, leafletBoundsHelpers, LOCATION_DEFAULT) {

      var vm = this;

      vm.rootService = rootService;
      vm.userServiceData = userServiceData;
      vm.videoServiceData = videoServiceData;
      vm.locationDefault = LOCATION_DEFAULT;
      vm.locationLoaded = false;

      function getUser () {
        return userServiceData.users;
      }
      getUser();

      videoService.getVideoList();

      vm.getHeaderTitle = function () {
        return videoService.selectCity;
      };

      vm.showedPoints = [];
      vm.markers = {};

      function getMapData() {

        if (videoServiceData.videoList.videos !== undefined) {

          vm.selectedVideos = [];

          if ($routeParams.place_id !== 'all') {
            videoServiceData.videoList.videos.forEach(function (video) {
              if(video.place_id === $routeParams.poi_id) {
                vm.selectedVideos.push(video);
              }
            });
          } else {
            vm.selectedVideos = videoServiceData.videoList.videos;
          }

          vm.showedPoints = vm.selectedVideos;

          vm.markers = {};

          vm.maxLatitude = Math.max.apply(Math, vm.showedPoints.map(function (point) {
            return Number(point.coordinates.latitude);
          }));

          vm.maxLongitude = Math.max.apply(Math, vm.showedPoints.map(function (point) {
            return Number(point.coordinates.longitude);
          }));

          vm.minLatitude = Math.min.apply(Math, vm.showedPoints.map(function (point) {
            return Number(point.coordinates.latitude);
          }));

          vm.minLongitude = Math.min.apply(Math, vm.showedPoints.map(function (point) {
            return Number(point.coordinates.longitude);
          }));

          vm.centerPointLatitude = (vm.maxLatitude + vm.minLatitude) / 2;
          vm.centerPointLongitude = (vm.maxLongitude + vm.minLongitude) / 2;

          vm.showedPoints.forEach(
            function (video, index) {

              if (video.id === $routeParams.video_id && $location.absUrl().indexOf($routeParams.video_id) > -1) {
                vm.latitude = Number(video.coordinates.latitude);
                vm.longitude = Number(video.coordinates.longitude);
                vm.zoom = 15;
              } else {
                vm.latitude = vm.centerPointLatitude;
                vm.longitude = vm.centerPointLongitude;
                vm.zoom = 3;
              }

              vm.markers[index] = {
                // group: 'video uploaded',
                lat: Number(video.coordinates.latitude),
                lng: Number(video.coordinates.longitude),
                data: video,
                icon: {
                  iconUrl: '../../images/video_icon.svg',
                  iconSize: [30, 50],
                  iconAnchor: [15, 50]
                }
              };

            }
          );

          var maxbounds = leafletBoundsHelpers.createBoundsFromArray([[vm.maxLatitude, vm.maxLongitude], [vm.minLatitude, vm.minLongitude]]);
          maxbounds.pad = 0.25;

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
            },
            maxbounds: maxbounds
          });
        } else {
          $location.path('/' + $routeParams.language + 'home');
        }
      }
      getMapData();

      function initWatchers() {

        if (videoServiceData.videoList.videos !== undefined) {
          if (videoServiceData.videoList.videos.length === 0) {
            vm.videoWatcher = $scope.$watch(
              function () {
                return videoService.userVideosLoaded;
              }, function (newValue) {
                if (newValue === true) {
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

        vm.markersReload = $scope.$watch(
          function () {
            return videoService.markersReload;
          }, function (newValue) {
            if (newValue === true) {
              getMapData();
              videoService.markersReload = false;
            }
          }
        );

      }
      initWatchers();

      var markerEvents = leafletMarkerEvents.getAvailableEvents();
      var eventName = markerEvents[0];
      $scope.$on('leafletDirectiveMarker.video-map.' + eventName, function (event, args) {
        vm.dataMarker = args.model.data;
        console.log(args);
      });

      vm.goToVideos = function () {
        $location.path($routeParams.language + '/home');
        videoService.reloadHome = true;
      };

    }
  ]
);
