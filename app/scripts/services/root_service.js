'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.service('rootService', ['$routeParams', '$location', 'SPANISH', 'ENGLISH', 'FRENCH', 'CROATIAN', 'DANISH','TURKISH', 'POLISH',
  function($routeParams, $location, SPANISH, ENGLISH, FRENCH, CROATIAN, DANISH, TURKISH, POLISH) {

  var service = this;

  service.openMenu = false;
  service.openFilter = false;
  service.updateLanguage = false;

  service.currentLanguage = '';

  if (navigator.language === 'es') {
    service.currentLanguage = 'es';
    $routeParams.language = service.currentLanguage;
    service.languageText = SPANISH;
    $location.path('/' + $routeParams.language + '/login');
  } else if (navigator.language === 'en') {
    service.currentLanguage = 'en';
    $routeParams.language = service.currentLanguage;
    service.languageText = ENGLISH;
    $location.path('/' + $routeParams.language + '/login');
  }else if (navigator.language === 'fr') {
    service.currentLanguage = 'fr';
    $routeParams.language = service.currentLanguage;
    service.languageText = FRENCH;
    $location.path('/' + $routeParams.language + '/login');
  }else if (navigator.language === 'cr') {
    service.currentLanguage = 'cr';
    $routeParams.language = service.currentLanguage;
    service.languageText = CROATIAN;
    $location.path('/' + $routeParams.language + '/login');
  }  else if (navigator.language === 'dn') {
    service.currentLanguage = 'dn';
    $routeParams.language = service.currentLanguage;
    service.languageText = DANISH;
    $location.path('/' + $routeParams.language + '/login');
  } else if (navigator.language === 'tk') {
    service.currentLanguage = 'tk';
    $routeParams.language = service.currentLanguage;
    service.languageText = TURKISH;
    $location.path('/' + $routeParams.language + '/login');
  } else if (navigator.language === 'pl') {
    service.currentLanguage = 'pl';
    $routeParams.language = service.currentLanguage;
    service.languageText = POLISH;
    $location.path('/' + $routeParams.language + '/login');
  } else {
    service.currentLanguage = 'en';
    $routeParams.language = service.currentLanguage;
    service.languageText = ENGLISH;
    $location.path('/' + $routeParams.language + '/login');
  }

  service.languages = [
    {
      languageName: 'Español',
      code: 'es'
    },
    {
      languageName: 'Français',
      code: 'fr'
    },
    {
      languageName: 'English',
      code: 'en'
    },
    {
      languageName: 'Hrvatski',
      code: 'cr'
    },
    {
      languageName: 'Dansk',
      code: 'da'
    },
    {
      languageName: 'Türk',
      code: 'tk'
    },
    {
      languageName: 'Polskie',
      code: 'pl'
    },
  ];

  service.toggleLanguage = function (code) {
    
    if (code === 'es') {
      service.currentLanguage = 'es';
      $routeParams.language = 'es';
      $location.path('/' + $routeParams.language + '/login');
      service.languageText = SPANISH;
    } else if (code === 'fr') {
      service.currentLanguage = 'fr';
      $routeParams.language = 'fr';
      $location.path('/' + $routeParams.language + '/login');
      service.languageText = FRENCH;
    } else if (code === 'en') {
      service.currentLanguage = 'en';
      $routeParams.language = 'en';
      $location.path('/' + $routeParams.language + '/login');
      service.languageText = ENGLISH;
    } else if (code === 'cr') {
      service.currentLanguage = 'cr';
      $routeParams.language = 'cr';
      $location.path('/' + $routeParams.language + '/login');
      service.languageText = CROATIAN;
    } else if (code === 'da') {
      service.currentLanguage = 'da';
      $routeParams.language = 'da';
      $location.path('/' + $routeParams.language + '/login');
      service.languageText = DANISH;
    } else if (code === 'tk') {
      service.currentLanguage = 'tk';
      $routeParams.language = 'tk';
      $location.path('/' + $routeParams.language + '/login');
      service.languageText = TURKISH;
    } else if (code === 'pl') {
      service.currentLanguage = 'pl';
      $routeParams.language = 'pl';
      $location.path('/' + $routeParams.language + '/login');
      service.languageText = POLISH;
    }

  };

  return service;

}]);
