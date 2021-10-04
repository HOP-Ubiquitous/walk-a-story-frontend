'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.service('locationService', ['locationServiceApi', 'locationServiceData', 'userServiceData', '$location', '$q', '$timeout', '$routeParams',
  function(locationServiceApi, locationServiceData, userServiceData, $location, $q, $timeout, $routeParams) {

  var service = this;

  service.updatedCity = false;
  service.reloadCities = false;

  service.openMenu = false;
  service.openFilter = false;
  service.openMessageWindow = false;
  service.citiesListLoaded = false;
  service.cityByIdLoaded = false;
  service.cityListyByPoiIdLoaded = false;
  service.poiByIdLoaded = false;
  service.reloadWalks = false;
  service.markersReload = false;
  service.selectCity = '';

  service.addCity = function (city, poi) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    locationServiceApi.add_city(city)
      .then(
        function success(response) {
          console.log(response.data);
          service.addPoi(poi, response.data.id);
          console.log('\x1b[32m%s\x1b[0m', 'Ciudad creada con éxito! :)');
        }
      )
      .catch(
        function error() {
          console.log('\x1b[31m%s\x1b[0m', 'Error al crear una ciudad! :_(');
        }
      );

    return promise;
  };

  service.updateCity = function (city, city_id) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    locationServiceApi.update_city(city, city_id)
      .then(
        function success(response) {
          console.log(response);
          console.log('\x1b[32m%s\x1b[0m', 'Ciudad actualizada con éxito! :)');
          $location.path('/' + $routeParams.language + '/location_management');
          service.updatedCity = true;
        }
      )
      .catch(
        function error() {
          console.log('\x1b[31m%s\x1b[0m', 'Error al actualizar una ciudad! :_(');
        }
      );

    return promise;
  };

  service.deleteCity = function (city_id) {
    var deferred = $q.defer();
    var promise = deferred.promise;

    locationServiceApi.delete_city(city_id)
      .then(
        function success(response) {
          console.log('\x1b[32m%s\x1b[0m', 'Ciudad con ' + city_id + " borrada con éxito! :)");
          service.updatedCity = true;
        }
      )
      .catch(
        function () {
          console.log('\x1b[31m%s\x1b[0m', 'Error al borrar la ciudad! :_(');
        }
      );

    return promise;

  };

  service.getCities = function () {

    var deferred = $q.defer();
    var promise = deferred.promise;

    locationServiceApi.get_cities()
      .then(
        function success(response) {
          locationServiceData.citiesList = response.data;
          service.reloadCities = true;
          console.log('\x1b[32m%s\x1b[0m', 'Ciudades recibidas con éxito! :)');
        }
      )
      .catch(
        function error() {
          console.log('\x1b[31m%s\x1b[0m', 'Error al recibir las ciudades! :_(');
        }
      );

    return promise;
  };

  service.getCitiesById = function (city_id) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    locationServiceApi.get_city_by_id(city_id)
      .then(
        function success(response) {
          locationServiceData.cityListById = response.data;
          service.cityByIdLoaded = true;
          console.log(response.data);
          console.log('\x1b[32m%s\x1b[0m', 'Ciudad con id ' + city_id + ' recibida con éxito! :)');
        }
      )
      .catch(
        function error() {
          console.log('\x1b[31m%s\x1b[0m', 'Error al recibir la ciudad con id ' + city_id + '! :_(');
        }
      );

    return promise;
  };

  service.getCityByPoiId = function (poi_id) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    locationServiceApi.get_city_by_poi_id(poi_id)
      .then(
        function success(response) {
          locationServiceData.cityListByPoiId = response.data.participants;
          service.cityListyByPoiIdLoaded = true;
          console.log('\x1b[32m%s\x1b[0m', 'Punto de interés con id ' + poi_id + ' recibido con éxito! :)');
        }
      )
      .catch(
        function error() {
          console.log('\x1b[31m%s\x1b[0m', 'Error al recibir el punto de interés con id ' + poi_id + '! :_(');
        }
      );

    return promise;
  };

  service.addPoi = function (poi, city_id) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    locationServiceApi.add_poi(poi, city_id)
      .then(
        function success(response) {
          $location.path('/' + $routeParams.language + '/location_management');
          console.log('\x1b[32m%s\x1b[0m', 'Punto de interés agregado a la ciudad con id ' + city_id + ' con éxito! :)');
          service.updatedCity = true;
        }
      )
      .catch(
        function error() {
          console.log('\x1b[31m%s\x1b[0m', 'Error al agregar un punto de interés a la ciudad con id ' + city_id + '! :_(');
        }
      );

    return promise;
  };

  service.updatePoi = function (data, poi_id) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    locationServiceApi.update_poi(data, poi_id)
      .then(
        function success(response) {
          console.log(response);
          console.log('\x1b[32m%s\x1b[0m', 'El punto de interés con id ' + poi_id + ' se ha actualizado con éxito! :)');
          service.updatedCity = true;
        }
      )
      .catch(
        function error() {
          console.log('\x1b[31m%s\x1b[0m', 'Error al actualizar el punto de interés con id ' + poi_id + '! :_(');
        }
      );

    return promise;
  };

  service.deletePoi = function (poi_id) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    locationServiceApi.delete_poi(poi_id)
      .then(
        function success(response) {
          console.log(response);
          console.log('\x1b[32m%s\x1b[0m', 'El punto de interés con id ' + poi_id + ' se ha borrado con éxito! :)');
          service.updatedCity = true;
        }
      )
      .catch(
        function error() {
          console.log('\x1b[31m%s\x1b[0m', 'Error al borrar el punto de interés con id ' + poi_id + '! :_(');
        }
      );

    return promise;
  };

  service.getPois = function() {
    var deferred = $q.defer();
    var promise = deferred.promise;

    locationServiceApi.get_pois()
      .then(
        function success(response) {
          locationServiceData.poisList = response.data;
          console.log('\x1b[32m%s\x1b[0m', 'Puntos de Interés recibidos con éxito! :)');
        }
      )
      .catch(
        function () {
          console.log('\x1b[31m%s\x1b[0m', 'Error al recibir todo slos Puntos de Interés! :_(');
        }
      );

    return promise;

  };

  service.getPoiById = function(poi_id) {
    var deferred = $q.defer();
    var promise = deferred.promise;

    locationServiceApi.get_poi_by_id(poi_id)
      .then(
        function success(response) {
          locationServiceData.poisListById = response.data;
          service.poiByIdLoaded = true;
          console.log('\x1b[32m%s\x1b[0m', 'Punto de Interés con id ' + poi_id + ' recibido con éxito! :)');
        }
      )
      .catch(
        function () {
          console.log('\x1b[31m%s\x1b[0m', 'Error al recibir el Punto de Interés con id ' + poi_id + '! :_(');
        }
      );

    return promise;

  };

  return service;

}]);
