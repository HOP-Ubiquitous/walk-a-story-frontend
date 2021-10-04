'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.controller('loginCtrl',
  [ 'rootService', '$location', 'userService', 'userServiceData', '$routeParams', '$cookies',
    function (rootService, $location, userService, userServiceData, $routeParams, $cookies) {

      var vm = this;
      vm.userService = userService;
      vm.rootService = rootService;
      vm.user = {
        username: '',
        password: ''
      };
      userServiceData.users = {};

      if ($cookies.get('users') !== undefined) {
        var usersCookie = JSON.parse($cookies.get('users'));

        if (usersCookie !== undefined) {
          userServiceData.users = usersCookie;
        }
      }

      if (userServiceData.users.username !== undefined) {
        vm.user.username = userServiceData.users.username;
      }

      vm.login = function () {

        var user = {
          username: vm.user.username,
          password: vm.user.password
        };

        userService.openMessageWindow = false;
        userService.login(user);

        // $location.path('/'+ $routeParams.language + '/home');

      };

      vm.goToHome = function () {
        $location.path('/'+ $routeParams.language + '/home');
      }

      vm.goToSignup = function (){
        $location.path('/'+ $routeParams.language + '/new_user');
      };
      vm.goToTerms = function (){
        $location.path('/'+ $routeParams.language + '/terms');
      };
      vm.goToSurvey = function (){
        $location.path('/'+ $routeParams.language + '/survey');
      };

    }]);
