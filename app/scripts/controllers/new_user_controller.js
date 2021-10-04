'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.controller('newUserCtrl',
  [ 'rootService', '$location', 'userService', '$routeParams',
    function (rootService, $location, userService, $routeParams) {

  var vm = this;

  vm.userService = userService;
  vm.rootService = rootService;

  vm.createUser = function () {

    var dateUtc = vm.user.birthDate;

    var user = {
      username: vm.user.alias,
      password: vm.user.password,
      birth_date: dateUtc,
      email: vm.user.mail,
      name: vm.user.name
    };

    userService.openMessageWindow = false;
    userService.createUser(user);

  };

  vm.goToLogin = function () {
    $location.path('/' + $routeParams.language + '/login');
  };

}]);
