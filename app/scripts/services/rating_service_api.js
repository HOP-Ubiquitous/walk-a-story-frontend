'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.service('ratingServiceApi', ['$http', 'API_URL', function($http, API_URL) {

  var apiService = {};
  var apiURL = API_URL.url;

  apiService.add_rating_vote_to_comment = function (rating) {
    return $http({
      method: 'POST',
      data: rating,
      url: apiURL + 'ratings/comment/vote',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.add_rating_report_to_comment = function (report) {
    return $http({
      method: 'POST',
      data: report,
      url: apiURL + 'ratings/comment/report',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.add_rating_vote_to_video = function (rating) {
    return $http({
      method: 'POST',
      data: rating,
      url: apiURL + 'ratings/video/vote',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.add_rating_report_to_video = function (report) {
    return $http({
      method: 'POST',
      data: report,
      url: apiURL + 'ratings/video/report',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  };

  apiService.get_rating_comments_by_user_id_and_video_id = function (user_id, video_id) {
    return $http({
      method: 'GET',
      url: apiURL + 'ratings/votes/user/' + user_id + '/video/' + video_id + '/comments',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  };

  apiService.get_reports_comments_by_user_id_and_video_id = function (user_id, video_id) {
    return $http({
      method: 'GET',
      url: apiURL + 'ratings/reports/user/' + user_id + '/video/' + video_id + '/comments',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  };

  apiService.get_rating_video_by_user_id_and_video_id = function (user_id, video_id) {
    return $http({
      method: 'GET',
      url: apiURL + 'ratings/votes/user/' + user_id + '/video/' + video_id,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  };

  apiService.get_reports_video_by_user_id_and_video_id = function (user_id, video_id) {
    return $http({
      method: 'GET',
      url: apiURL + 'ratings/reports/user/' + user_id + '/video/' + video_id,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  };

  apiService.delete_rating = function (rating_id) {
    return $http({
      method: 'DELETE',
      url: apiURL + 'ratings/' + rating_id,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  };

  return apiService;

}]);
