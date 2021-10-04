'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.controller('walkLocationCtrl', ['rootService', '$location', 'userServiceData', 'walkService', 'walkServiceData', '$scope', '$routeParams', 'leafletMarkerEvents', 'leafletData', 'leafletBoundsHelpers',
  function (rootService, $location, userServiceData,walkService, walkServiceData, $scope, $routeParams, leafletMarkerEvents, leafletData, leafletBoundsHelpers) {

  var vm = this;

  vm.rootService = rootService;
  vm.userServiceData = userServiceData;
  vm.walkService = walkService;
  vm.walkServiceData = walkServiceData;
  $scope.selectCity = walkService.selectCity;
  vm.walksLoaded = false;

  function getUser () {
    return userServiceData.users;
  }
  getUser();

  walkService.getWalks();

  vm.getHeaderTitle = function () {
    return walkService.selectCity;
  };

  vm.showedPoints = [];
  vm.markers = {};

  function getMapData() {

    if (walkServiceData.walkList !== undefined) {

      vm.selectedWalks = [];

      if ($routeParams.place_id !== 'all') {
        walkServiceData.walkList.forEach(function (walk) {
          if(walk.place_id === $routeParams.poi_id) {
            vm.selectedWalks.push(walk);
          }
        });
      } else {
        vm.selectedWalks = walkServiceData.walkList;
      }

      vm.showedPoints = vm.selectedWalks;

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

      vm.showedPoints.forEach(function (walk, index) {

        if (walk.caminata_id === $routeParams.walk_id && $location.absUrl().indexOf($routeParams.walk_id) > -1) {
          vm.latitude = Number(walk.coordinates.latitude);
          vm.longitude = Number(walk.coordinates.longitude);
          vm.zoom = 15;
        } else {
          vm.latitude = vm.centerPointLatitude;
          vm.longitude = vm.centerPointLongitude;
          vm.zoom = 3;
        }

        vm.markers[index] = {
          // group: 'walk event',
          lat: Number(walk.coordinates.latitude),
          lng: Number(walk.coordinates.longitude),
          message: '<p>' + walk.title + '</p><p>' + walk.address + '</p>',
          data: walk,
          focus: false,
          icon: {
            iconUrl: '../../images/walk_icon.svg',
            iconSize: [30, 50],
            iconAnchor: [15, 50]
          }
        };

      });

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
      $location.path('/' + $routeParams.language +'/walks');
    }

  }
  getMapData();

  var markerEvents = leafletMarkerEvents.getAvailableEvents();
  var eventName = markerEvents[0];
  $scope.$on('leafletDirectiveMarker.walk-map.' + eventName, function(event, args){
    vm.dataMarker = args.model.data;
    console.log(args);
  });

  vm.goToWalks = function () {
    walkService.reloadWalks = true;
    $location.path($routeParams.language + '/walks');
  };

  vm.locationInfoStyle = true;

  if (userServiceData.users.admin === true) {
    debugger;
    vm.locationInfoStyle = true;
  } else {
    debugger;
    vm.locationInfoStyle = false;
  }

  function initWatchers() {

    if (walkServiceData.walkList !== undefined) {
      if (walkServiceData.walkList.length === 0) {
        vm.walkWatcher = $scope.$watch(
          function () {
            return walkService.walkListLoaded;
          }, function (newValue) {
            if (newValue === true) {
              vm.walksLoaded = true;
              walkService.walkListLoaded = false;
            }
          }
        );
      } else {
        vm.mapWatcher = $scope.$watch(
          function () {
            return vm.walksLoaded;
          }, function (newValue) {
            if (newValue === true) {
              getMapData();
              vm.walksLoaded = false;
            }
          }
        );
      }
    }

    vm.markersReload = $scope.$watch(
      function () {
        return walkService.markersReload;
      }, function (newValue) {
        if (newValue === true) {
          getMapData();
          walkService.markersReload = false;
        }
      }
    );

  }

  initWatchers();

}]);
