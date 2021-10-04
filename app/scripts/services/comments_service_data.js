'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.service('commentsServiceData', ['$cookies', function($cookies) {

  var ratingService = {};

  ratingService.commentsList = [];
  ratingService.commentsListByVideo = [];

  return ratingService;

}]);
