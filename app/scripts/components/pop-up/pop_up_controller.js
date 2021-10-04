app.controller('popUpCtrl',
  ['rootService', 'userService', 'userServiceData',
    function (rootService, userService, userServiceData) {

      var vm = this;
      vm.rootService = rootService;

      function getUser () {
        return userServiceData.users;
      }
      getUser();

    }
  ]
);
