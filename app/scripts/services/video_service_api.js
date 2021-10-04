'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.service('videoServiceApi', ['$http', 'API_URL', function($http, API_URL) {

  var apiService = {};
  var apiURL = API_URL.url;

  apiService.get_video_list = function () {
    return $http({
      method: 'GET',
      url: apiURL + 'list?',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.get_video_by_id = function (video_id) {
    return $http({
      method: 'GET',
      url: apiURL + 'video_id/' + video_id,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.get_video_list_by_place = function (placeId) {
    return $http({
      method: 'GET',
      url: apiURL + 'list/place/' + placeId,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.get_video_list_by_user = function (userId) {
    return $http({
      method: 'GET',
      url: apiURL + 'list/user/' + userId,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.get_file = function (place, video) {
    return $http({
      method: 'GET',
      url: apiURL + place + '/' + video,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.get_file_by_id = function (videoId) {
    return $http({
      method: 'GET',
      url: apiURL + 'id/' + videoId
    });
  };

  apiService.upload_video = function (data, place) {
    return $http({
      method: 'POST',
      data: data,
      url: apiURL + place,
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

  apiService.video_to_private = function (data, videoId) {
    return $http({
      method: 'PUT',
      data: data,
      url: apiURL + 'private/' + videoId,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.video_to_revision = function (data, videoId) {
    return $http({
      method: 'PUT',
      data: data,
      url: apiURL + 'rev/' + videoId,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.video_to_public = function (data, videoId) {
    return $http({
      method: 'PUT',
      data: data,
      url: apiURL + 'public/' + videoId,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.delete_video = function (videoId) {
    return $http({
      method: 'DELETE',
      url: apiURL + videoId,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.undelete_video = function (data, videoId) {
    return $http({
      method: 'PUT',
      data: data,
      url: apiURL + 'undelete/' + videoId,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  return apiService;

}]);
