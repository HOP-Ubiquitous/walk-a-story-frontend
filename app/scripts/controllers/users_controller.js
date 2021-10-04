'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.controller('usersCtrl',[ 'rootService', 'userService', 'userServiceData',
  function(rootService, userService, userServiceData) {

  var vm = this;
  vm.rootService = rootService;
  vm.userServiceData = userServiceData;

  function getUser () {
    return userServiceData.users;
  }
  getUser();

  userService.getUserList();

  vm.getUserList = function() {
    return userServiceData.userList.users;
  };

  console.log(userServiceData.userList);

  vm.deleteUserByAdmin = function (user) {

    var userSelected = {
      user_id: user.id
    };

    userService.deleteUserByAdmin(userSelected);
  }

  vm.upgradeRole = function (user) {

    var userData = {
      user_id: user.id,
      admin: true
    };

    userService.updateRole(userData);
  };

  vm.downgradeRole = function (user) {

    var userData = {
      user_id: user.id,
      admin: false
    };

    userService.updateRole(userData);
  };

}]);
