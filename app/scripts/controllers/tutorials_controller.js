'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.controller('tutorialsCtrl', ['rootService', '$location', 'userServiceData', '$routeParams',
  function (rootService, $location, userServiceData, $routeParams) {

  var vm = this;

  vm.rootService = rootService;
  vm.userServiceData = userServiceData;

  function getUser () {
    return userServiceData.users;
  };
  getUser();

  vm.goToUpload = function () {
    $location.path('/' + $routeParams.language + '/upload');
  };

}]);
