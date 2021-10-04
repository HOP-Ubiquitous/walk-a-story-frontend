'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.service('walkServiceData', [ function() {

  var walkService = {};

  walkService.walkList = [];
  walkService.walkListById = [];
  walkService.walkListByIdParticipants = [];
  walkService.walkListByPlace = [];
  walkService.walkListByPoi = [];
  walkService.walkListByParticipantUser = [];
  walkService.walkListByRegisteredUser = [];
  walkService.walkListUrls = [];
  walkService.walkListFiltered = [];

  return walkService;

}]);
