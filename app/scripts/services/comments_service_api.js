'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.service('commentsServiceApi', ['$http', 'API_URL', function($http, API_URL) {

  var apiService = {};
  var apiURL = API_URL.url;

  apiService.add_comment = function (comment) {
    return $http({
      method: 'POST',
      data: comment,
      url: apiURL + 'comments',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.get_comments = function () {
    return $http({
      method: 'GET',
      url: apiURL + 'comments',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  };

  apiService.get_comments_by_video_id = function (video_id) {
    return $http({
      method: 'GET',
      url: apiURL + 'comments/video/' + video_id,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  };

  apiService.put_comment_enabled = function (comment_id) {
    return $http({
      method: 'PUT',
      url: apiURL + 'comments/' + comment_id + '/enable',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  };

  apiService.put_comment_disabled = function (comment_id) {
    return $http({
      method: 'PUT',
      url: apiURL + 'comments/' + comment_id + '/disable',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  };

  apiService.delete_comment = function (comment_id) {
    return $http({
      method: 'DELETE',
      url: apiURL + 'comments/' + comment_id,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  };

  return apiService;

}]);
