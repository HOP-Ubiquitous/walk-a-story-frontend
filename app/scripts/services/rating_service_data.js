'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.service('ratingServiceData', ['$cookies', function($cookies) {

  var ratingService = {};

  ratingService.ratingByVideo = [];
  ratingService.ratingByComment = [];
  ratingService.reportByVideo = [];
  ratingService.reportByComment = [];

  return ratingService;

}]);
