'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.controller('addPlaceCtrl', [ 'rootService', '$scope', '$routeParams', 'userServiceData', 'locationService', 'leafletMarkerEvents',
  function (rootService, $scope, $routeParams, userServiceData, locationService, leafletMarkerEvents) {

    var vm = this;

    vm.place = {};
    vm.locationService = locationService;
    vm.rootService = rootService;

    vm.getUser = function () {
      return userServiceData.users;
    };

    function getMapData(lat, lng, zoom) {

      if (lat === undefined && lng === undefined) {
        if ($routeParams.language === 'es') {
          lat = 40.416864;
          lng = -3.703417;
        } else if ($routeParams.language === 'en') {
          lat = 51.508229;
          lng = -0.128258;
        } else if ($routeParams.language === 'fr') {
          lat = 48.861455;
          lng = 2.334136;
        } else if ($routeParams.language === 'cr') {
          lat = 45.800501;
          lng = 15.979015;
        } else if ($routeParams.language === 'dn') {
          lat = 55.675467;
          lng = 12.571028;
        } else if ($routeParams.language === 'tk') {
          lat = 39.933357;
          lng = 32.859438;
        } else if ($routeParams.language === 'pl') {
          lat = 52.2431473;
          lng = 21.0123283;
        } else {
          lat = 40.416864;
          lng = -3.703417;
        }
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
        center: {
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

    $scope.$on('leafletDirectiveMap.places.click', function(event, args){
      vm.place.poi_latitude = args.leafletEvent.latlng.lat;
      vm.place.poi_longitude = args.leafletEvent.latlng.lng;
      getMapData(args.leafletEvent.latlng.lat, args.leafletEvent.latlng.lng, args.leafletObject._zoom);
    });

    vm.addCity = function () {
      var city = {
        name: vm.place.city_name,
      };

      var poi = {
        name: vm.place.poi_name,
        latitude: vm.place.poi_latitude,
        longitude: vm.place.poi_longitude
      };

      vm.locationService.addCity(city, poi);

    };


  }]);
