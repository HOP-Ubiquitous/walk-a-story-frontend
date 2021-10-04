'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.controller('addPoiCtrl', [ 'rootService', '$scope', 'userServiceData', 'locationService', 'locationServiceData', '$routeParams', 'leafletMarkerEvents',
  function (rootService, $scope, userServiceData, locationService, locationServiceData, $routeParams, leafletMarkerEvents) {

    var vm = this;

    vm.place = {};
    vm.locationService = locationService;
    vm.rootService = rootService;

    vm.getUser = function () {
      return userServiceData.users;
    };

    function getLocation () {
      locationService.getCitiesById($routeParams.place_id);
    }
    getLocation();

    function getMapData(lat, lng, zoom) {

      if (lat === undefined && lng === undefined) {
        lat = 47.962908;
        lng = 24.187333;
        zoom = 8;
      }

      vm.markers = {};
      vm.markers[0] = {
        lat: Number(lat),
        lng: Number(lng),
        focus: false,
        data: '',
        icon: {
          iconUrl: '../../images/build_icon.svg',
          iconSize: [30, 50],
          iconAnchor: [15, 50]
        }
      };

      angular.extend($scope, {
        defaults: {
          tileLayer: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
          maxZoom: 17
        },
        centerpoi: {
          lat: lat,
          lng: lng,
          zoom: zoom
        },
        markers: angular.copy(vm.markers),
        events: {
          markers: {
            enable: leafletMarkerEvents.getAvailableEvents()
          },
          map: {
            enable: ['click'],
            logic: 'emit'
          }

        }
      });

    }
    getMapData();

    $scope.$on('leafletDirectiveMap.poisMap.click', function(event, args){
      vm.place.poi_latitude = args.leafletEvent.latlng.lat;
      vm.place.poi_longitude = args.leafletEvent.latlng.lng;
      getMapData(args.leafletEvent.latlng.lat, args.leafletEvent.latlng.lng, args.leafletObject._zoom);
    });

    vm.addPoi = function () {
      var poi = {
        name: vm.place.poi_name,
        latitude: vm.place.poi_latitude,
        longitude: vm.place.poi_longitude
      };

      vm.locationService.addPoi(poi, $routeParams.place_id);

    };

    function initWatchers() {

      vm.videoWatcher = $scope.$watch(
        function () {
          return locationService.cityByIdLoaded;
        }, function (newValue) {
          if (newValue === true) {
            getMapData(Number(locationServiceData.cityListById.points_of_interest[0].latitude), Number(locationServiceData.cityListById.points_of_interest[0].longitude), 8);
            locationService.cityByIdLoaded = false;
          }
        }
      );

    }

    initWatchers();


  }]);
