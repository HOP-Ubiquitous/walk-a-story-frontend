app.directive('popUp', function () {

  return {
    restrict: 'EA',
    scope: {
      show: '=',
      iconCircle: '@',
      icon: '@',
      title: '=',
      question: '@',
      showButtons: '=',
      cancelButton: '=',
      deleteButton: '=',
      deleteFunction: '&',
      unDeleteButton: '=',
      unDeleteFunction: '&',
      privateButton: '=',
      privateFunction: '&',
      publishButton: '=',
      publishFunction: '&',
      updateRolButton: '=',
      updateRolFunction: '&',
      downgradeRolButton: '=',
      downgradeRolFunction: '&'
    },
    controller: 'popUpCtrl',
    controllerAs: 'popUp',
    templateUrl: 'views/pop-up.html'
  };

});
