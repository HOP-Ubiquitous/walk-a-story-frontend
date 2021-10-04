'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.service('videoServiceData', [ function() {

  var videoService = {};

  videoService.videoList = [];
  videoService.videoListByUser = [];
  videoService.videoListByPlace = [];
  videoService.videoListByPoi = [];
  videoService.videoById = [];

  return videoService;

}]);
