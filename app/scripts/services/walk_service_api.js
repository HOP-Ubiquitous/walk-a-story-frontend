'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.service('walkServiceApi', ['$http', '$cookies', 'API_URL', function($http, $cookies, API_URL) {

  var apiService = {};
  var apiURL = API_URL.url;

  apiService.add_walk = function (data) {
    return $http({
      method: 'POST',
      data: data,
      url: apiURL + 'caminatas',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
      // transformRequest: angular.identity
    });
  };

  apiService.add_walk_image = function (image) {
    return $http({
      method: 'POST',
      data: image,
      url: apiURL + 'image',
      headers: {
        'Content-Type': undefined,
        'Access-Control-Allow-Origin': '*'
      },
      transformRequest: angular.identity
    });
  };

  apiService.update_walk = function (data, walk_id) {
    return $http({
      method: 'PATCH',
      data: data,
      url: apiURL + 'caminatas/' + walk_id,
      headers: {
        'Content-Type': undefined,
        'Access-Control-Allow-Origin': '*'
      },
      transformRequest: angular.identity
    });
  };

  apiService.delete_walk = function (walk_id) {
    return $http({
      method: 'DELETE',
      url: apiURL + '/caminatas/' + walk_id,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.get_walks = function () {
    return $http({
      method: 'GET',
      url: apiURL + 'caminatas/',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.get_walk_by_id = function (walk_id) {
    return $http({
      method: 'GET',
      url: apiURL + 'caminatas/' + walk_id,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.get_walk_by_id_participants = function (walk_id) {
    return $http({
      method: 'GET',
      url: apiURL + 'caminatas/' + walk_id + '?option=participants',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.get_walk_by_place_id = function (place_id) {
    return $http({
      method: 'GET',
      url: apiURL + 'caminatas/place/' + place_id,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.get_walk_by_participant_user = function (user_id) {
    return $http({
      method: 'GET',
      url: apiURL + 'caminatas/partipant/' + user_id,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.get_walk_by_registered_user = function (user_id) {
    return $http({
      method: 'GET',
      url: apiURL + 'caminatas/registered/' + user_id,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.put_participant_to_walk = function (user, walk_id) {
    return $http({
      method: 'PUT',
      data: user,
      url: apiURL + 'caminatas/' + walk_id + '/participant',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.delete_participant_from_walk = function (user, walk_id) {
    return $http({
      method: 'DELETE',
      data: user,
      url: apiURL + '/caminatas/' + walk_id + '/participant',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  return apiService;

}]);
