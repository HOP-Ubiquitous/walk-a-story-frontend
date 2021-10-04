app.directive('filterMenu', function () {

  return {
    restrict: 'EA',
    scope: {
      adjustClass: '@',
    },
    controller: 'filterMenuCtrl',
    controllerAs: 'filterMenu',
    templateUrl: 'views/filter-menu.html'
  };

});
