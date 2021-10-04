'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.service('userServiceApi', ['$http', 'API_URL', function($http, API_URL) {

  var apiService = {};
  var apiURL = API_URL.url;

  apiService.login = function (user) {
    return $http({
      method: 'POST',
      data: user,
      url: apiURL + 'users/login',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.logout = function () {
    return $http({
      method: 'POST',
      url: apiURL + 'users/logout',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.create_user = function (user) {
    return $http({
      method: 'POST',
      data: user,
      url: apiURL + 'users/register',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.update_role = function (user) {
    return $http({
      method: 'POST',
      data: user,
      url: apiURL + 'users/admin',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.get_user_list = function () {
    return $http({
      method: 'GET',
      url: apiURL + 'users/all',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.delete_user_by_user = function (user) {
    return $http({
      method: 'DELETE',
      data: user,
      url: apiURL + 'users/delete_admin',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.delete_user_by_admin = function (user) {
    return $http({
      method: 'DELETE',
      data: user,
      url: apiURL + 'users/delete_admin',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  return apiService;

}]);
