'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.service('userServiceData', [function() {

  var userService = {};

  userService.users = {};
  userService.userList = [];

  return userService;

}]);
