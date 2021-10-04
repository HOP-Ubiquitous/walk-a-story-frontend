'use strict';

app.controller('localEcosystemLocationCtrl',
  ['rootService', '$location', 'userServiceData', 'localEcosystemService', 'localEcosystemServiceData', '$scope', '$routeParams', 'leafletMarkerEvents', 'leafletData', 'leafletBoundsHelpers', 'LOCATION_DEFAULT',
    function (rootService, $location, userServiceData, localEcosystemService, localEcosystemServiceData, $scope, $routeParams, leafletMarkerEvents, leafletData, leafletBoundsHelpers, LOCATION_DEFAULT) {

      var vm = this;

      vm.rootService = rootService;
      vm.userServiceData = userServiceData;
      vm.localEcosystemService = localEcosystemService;
      vm.localEcosystemServiceData = localEcosystemServiceData;
      vm.locationDefault = LOCATION_DEFAULT;
      vm.locationLoaded = false;

      function getUser () {
        return userServiceData.users;
      }
      getUser();

      localEcosystemService.getLocals();

      vm.getHeaderTitle = function () {
        return localEcosystemService.selectCity;
      };

      vm.showedPoints = [];
      vm.markers = {};

      function getMapData() {

        if (localEcosystemServiceData.localList !== undefined) {

          vm.selectedVideos = [];

          // if ($routeParams.place_id !== 'all') {
          //   localEcosystemServiceData.localList.forEach(function (local) {
          //     //TODO quitar sustituir poi por type and local id
          //     if(local.place_id === $routeParams.poi_id) {
          //       vm.selectedVideos.push(local);
          //     }
          //   });
          // } else {
          //   vm.selectedVideos = localEcosystemServiceData.localList;
          // }

          vm.showedPoints = localEcosystemServiceData.localList;

          // vm.showedPoints = vm.selectedVideos;

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

          vm.showedPoints.forEach(function (video, index) {

              if (video.id === $routeParams.video_id && $location.absUrl().indexOf($routeParams.video_id) > -1) {
                vm.latitude = Number(video.coordinates.latitude);
                vm.longitude = Number(video.coordinates.longitude);
                vm.zoom = 15;
              } else {
                vm.latitude = vm.centerPointLatitude;
                vm.longitude = vm.centerPointLongitude;
                vm.zoom = 3;
              }

              var icon = '';

              if (video.type === 'HORECA') {
                if (video.isActive === true) {
                  icon = '../../images/horeca_icon.svg';
                } else {
                  icon = '../../images/horeca_close_icon.svg';
                }
              } else if (video.type === 'Sports associations') {
                if (video.isActive === true) {
                  icon = '../../images/sport_icon.svg';
                } else {
                  icon = '../../images/sport_close_icon.svg';
                }
              } else if (video.type === 'Events') {
                if (video.isActive === true) {
                  icon = '../../images/event_icon.svg';
                } else {
                  icon = '../../images/event_close_icon.svg';
                }
              } else if (video.type === 'Tourism') {
                if (video.isActive === true) {
                  icon = '../../images/tourism_icon.svg';
                } else {
                  icon = '../../images/tourism_close_icon.svg';
                }
              }

              vm.markers[index] = {
                // group: 'video uploaded',
                lat: Number(video.coordinates.latitude),
                lng: Number(video.coordinates.longitude),
                data: video,
                icon: {
                  iconUrl: icon,
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

      var markerEvents = leafletMarkerEvents.getAvailableEvents();
      var eventName = markerEvents[0];
      $scope.$on('leafletDirectiveMarker.local-ecosystem-map.' + eventName, function (event, args) {
        vm.dataMarker = args.model.data;
        console.log(args);
      });

      vm.goToLocal = function (typeId, subtypeId, id) {
        $routeParams.type_id = typeId;
        $routeParams.subtype_id = subtypeId;
        $routeParams.local_id = id;

        $location.path($routeParams.language + '/local_ecosystem/' + $routeParams.type_id + '/' + $routeParams.subtype_id + '/' + $routeParams.local_id);
      };

      vm.goToVideos = function () {
        $location.path($routeParams.language + '/home');
        localEcosystemService.reloadHome = true;
      };

      vm.goToAddLocal = function () {
        $location.path($routeParams.language + '/local_ecosystem/add_local');
      };

      vm.goToMyLocal = function () {
        var userId = userServiceData.users.id;

        localEcosystemService.getLocalsByOwnerId(userId);
      };

      vm.goToOwnerLocal = function (local) {
        $routeParams.type_id = local.type;
        $routeParams.subtype_id = local.subtype;
        $routeParams.local_id = local.id;

        $location.path($routeParams.language + '/local_ecosystem/' + $routeParams.type_id + '/' + $routeParams.subtype_id + '/' + $routeParams.local_id);
      };

      function initWatchers() {

        if (localEcosystemServiceData.localList !== undefined) {
          if (localEcosystemServiceData.localList.length === 0) {
            // vm.videoWatcher = $scope.$watch(
            //   function () {
            //     return localEcosystemService.userVideosLoaded;
            //   }, function (newValue) {
            //     if (newValue === true) {
            //       vm.locationLoaded = true;
            //       localEcosystemService.userVideosLoaded = false;
            //     }
            //   }
            // );
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
            return localEcosystemService.markersReload;
          }, function (newValue) {
            if (newValue === true) {
              getMapData();
              localEcosystemService.markersReload = false;
            }
          }
        );

      }
      initWatchers();

    }
  ]
);
