'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.controller('termsCtrl',
  [ 'rootService', '$location', 'userService', '$routeParams',
    function (rootService, $location, userService, $routeParams) {

      var vm = this;

      vm.rootService = rootService;
      vm.userService = userService;

      vm.goToLogin = function () {
        $location.path('/' + $routeParams.language + '/login');
      };

    }]);
