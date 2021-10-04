'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.service('locationServiceApi', ['$http', '$cookies', 'API_URL', function($http, $cookies, API_URL) {

  var apiService = {};
  var apiURL = API_URL.url;


  apiService.add_city = function (data) {
    return $http({
      method: 'POST',
      data: data,
      url: apiURL + 'places/cities',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.update_city = function (data, city_id) {
    return $http({
      method: 'PATCH',
      data: data,
      url: apiURL + 'places/cities/' + city_id,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });
  };

  apiService.delete_city = function (city_id) {
    return $http({
      method: 'DELETE',
      url: apiURL + 'places/cities/' + city_id,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.get_cities = function () {
    return $http({
      method: 'GET',
      url: apiURL + 'places/cities',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.get_city_by_id = function (city_id) {
    return $http({
      method: 'GET',
      url: apiURL + 'places/cities/' + city_id,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.get_city_by_poi_id = function (poi_id) {
    return $http({
      method: 'GET',
      url: apiURL + 'places/cities?poi_id=' + poi_id,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.add_poi = function (data, city_id) {
    return $http({
      method: 'POST',
      data: data,
      url: apiURL + 'places/cities/' + city_id + '/pois',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.update_poi = function (data, poi_id) {
    return $http({
      method: 'PATCH',
      data: data,
      url: apiURL + 'places/cities/pois/' + poi_id,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });
  };

  apiService.delete_poi = function (poi_id) {
    return $http({
      method: 'DELETE',
      url: apiURL + 'places/cities/pois/' + poi_id,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.get_pois = function () {
    return $http({
      method: 'GET',
      url: apiURL + 'places/cities/pois',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.get_poi_by_id = function (poi_id) {
    return $http({
      method: 'GET',
      url: apiURL + 'places/cities/pois/' + poi_id,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  return apiService;

}]);
