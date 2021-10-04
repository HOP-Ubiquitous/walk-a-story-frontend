'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.service('localEcosystemServiceApi', ['$http', '$cookies', 'API_URL', function($http, $cookies, API_URL) {

  var apiService = {};
  var apiURL = API_URL.url;

  apiService.add_local = function (data) {

    return $http({
      method: 'POST',
      data: data,
      url: apiURL + 'locations',
      headers: {
        'Content-Type': undefined,
        'Access-Control-Allow-Origin': '*'
      },
      transformRequest: angular.identity
    });
  };

  apiService.add_local_image = function (image) {
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

  apiService.update_local = function (data, local_id) {
    return $http({
      method: 'PATCH',
      data: data,
      url: apiURL + 'locations/' + local_id,
      headers: {
        'Content-Type': undefined,
        'Access-Control-Allow-Origin': '*'
      },
      // transformRequest: angular.identity
    });
  };

  apiService.delete_local = function (local_id) {
    return $http({
      method: 'DELETE',
      url: apiURL + 'locations/' + local_id,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.get_locals = function () {
    return $http({
      method: 'GET',
      url: apiURL + 'locations',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.get_locals_by_id = function (local_id) {
    return $http({
      method: 'GET',
      url: apiURL + 'locations/' + local_id,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.get_locals_by_type = function (type) {
    return $http({
      method: 'GET',
      url: apiURL + 'locations?type=' + type,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.get_locals_by_subtype = function (subtype) {
    return $http({
      method: 'GET',
      url: apiURL + 'locations?subtype=' + subtype,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.get_locals_by_owner_id = function (owner_id) {
    return $http({
      method: 'GET',
      url: apiURL + 'locations?ownerUserId=' + owner_id,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.set_local_active = function (local_id) {
    return $http({
      method: 'PUT',
      url: apiURL + 'locations/' + local_id + '/active',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.set_local_inactive = function (local_id) {
    return $http({
      method: 'PUT',
      url: apiURL + 'locations/' + local_id + '/inactive',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.upload_video = function (data, type) {
    return $http({
      method: 'POST',
      data: data,
      url: apiURL + type,
      headers: {
        'Content-Type': undefined,
        'Access-Control-Allow-Origin': '*'
      },
      transformRequest: angular.identity
    });
  };

  apiService.upload_register = function (data) {
    return $http({
      method: 'POST',
      data: data,
      url: apiURL + 'register',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  return apiService;

}]);
