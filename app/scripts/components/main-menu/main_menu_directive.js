app.directive('mainMenu', function () {

  return {
    restrict: 'EA',
    scope: {
      adjustClass: '@',
    },
    controller: 'mainMenuCtrl',
    controllerAs: 'mainMenu',
    templateUrl: 'views/main-menu.html'
  };

});
