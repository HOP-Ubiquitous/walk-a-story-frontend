'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.controller('surveyCtrl',
  [ 'rootService', '$location', 'userService', '$routeParams',
    function (rootService, $location, userService, $routeParams) {

      var vm = this;

      vm.rootService = rootService;

      vm.goToLogin = function () {
        $location.path('/' + $routeParams.language + '/login');
      };

    }]);
