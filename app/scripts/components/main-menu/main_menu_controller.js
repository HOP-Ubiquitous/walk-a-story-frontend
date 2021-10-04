app.controller('mainMenuCtrl',
  ['rootService', 'userService', 'userServiceData', '$location', '$routeParams', 'SPANISH', 'FRENCH', 'ENGLISH', 'CROATIAN', 'DANISH', 'TURKISH', 'POLISH',
    function (rootService, userService, userServiceData, $location, $routeParams, SPANISH, FRENCH, ENGLISH, CROATIAN, DANISH, TURKISH, POLISH) {

      var vm = this;
      vm.rootService = rootService;
      vm.userServiceData = userServiceData;

      if ($routeParams.language === 'es') {
        vm.languageText = SPANISH;
      } else if ($routeParams.language === 'fr') {
        vm.languageText = FRENCH;
      } else if ($routeParams.language === 'en') {
        vm.languageText = ENGLISH;
      } else if ($routeParams.language === 'cr') {
        vm.languageText = CROATIAN;
      } else if ($routeParams.language === 'da') {
        vm.languageText = DANISH;
      } else if ($routeParams.language === 'tk') {
        vm.languageText = TURKISH;
      } else if ($routeParams.language === 'pl') {
        vm.languageText = POLISH;
      }

      function getUser () {
        return userServiceData.users;
      }
      getUser();

      vm.goToHome = function () {
        $location.path('/' + $routeParams.language + '/home');
      };

      vm.goToProfile = function () {
        $location.path('/' + $routeParams.language + '/profile');
      };

      vm.goToUpload = function () {
        $location.path('/' + $routeParams.language + '/upload');
      };

      vm.goToWalks = function () {
        $location.path('/' + $routeParams.language + '/walks');
      };

      vm.goToLocalEcosystem = function () {
        $location.path('/' + $routeParams.language + '/local_ecosystem');
      };

      vm.goToTutorials = function () {
        $location.path('/' + $routeParams.language + '/tutorials');
      };

      vm.goToUsers = function () {
        $location.path('/' + $routeParams.language + '/users');
      };

      vm.goToLocationManagement = function () {
        $location.path('/' + $routeParams.language + '/location_management');
      };

      vm.goToLogin = function () {
        userService.logout();
      };

    }
  ]
);
