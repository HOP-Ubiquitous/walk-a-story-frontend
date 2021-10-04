'use strict';

/**
 * @ngdoc overview
 * @name cocrewVideoRecorderApp
 * @description
 * # cocrewVideoRecorderApp
 *
 * Main module of the application.
 */
var app = angular.module('cocrewVideoRecorderApp', [
  'ngAnimate',
  'ngAria',
  'ngCookies',
  'ngMessages',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngTouch',
  'route-segment',
  'view-segment',
  'ngMaterial',
  '720kb.socialshare',
  'nemLogging',
  'ui-leaflet'
]);

app.config(['$routeSegmentProvider', '$routeProvider', '$locationProvider', '$qProvider',
  function ($routeSegmentProvider, $routeProvider, $locationProvider, $qProvider) {

    $locationProvider.html5Mode({
      enabled: false,
      requireBase: true,
      rewriteLinks: true
    }).hashPrefix('');

    $routeSegmentProvider
      .when('/:language/login', 'language.login')
      .when('/:language/new_user', 'language.new_user')
      .when('/:language/terms', 'language.terms')
      .when('/:language/survey', 'language.survey')
      .when('/:language/home', 'language.home')
      .when('/:language/home/location', 'language.home.location')
      .when('/:language/home/location/:place_id', 'language.home.location.place_id')
      .when('/:language/home/location/:place_id/:poi_id', 'language.home.location.place_id.poi_id')
      .when('/:language/home/location/:place_id/:poi_id/:video_id', 'language.home.location.place_id.poi_id.video_id')
      .when('/:language/home/:place_id', 'language.home.place_id')
      .when('/:language/home/:place_id/:poi_id', 'language.home.place_id.poi_id')
      .when('/:language/home/:place_id/:poi_id/:video_id', 'language.home.place_id.poi_id.video_id')
      .when('/:language/profile', 'language.profile')
      .when('/:language/profile/location', 'language.profile.location')
      .when('/:language/profile/location/:video_id', 'language.profile.location.video_id')
      .when('/:language/walks', 'language.walks')
      .when('/:language/walks/location', 'language.walks.location')
      .when('/:language/walks/location/:place_id', 'language.walks.location.place_id')
      .when('/:language/walks/location/:place_id/:poi_id', 'language.walks.location.place_id.poi_id')
      .when('/:language/walks/location/:place_id/:poi_id/:walk_id', 'language.walks.location.place_id.poi_id.walk_id')
      .when('/:language/walks/:place_id', 'language.walks.place_id')
      .when('/:language/walks/:place_id/:poi_id', 'language.walks.place_id.poi_id')
      .when('/:language/walks/:place_id/:poi_id/:walk_id', 'language.walks.place_id.poi_id.walk_id')
      .when('/:language/add_walk', 'language.add_walk')
      .when('/:language/location_management', 'language.location_management')
      .when('/:language/location_management/add_place', 'language.location_management.add_place')
      .when('/:language/location_management/:place_id', 'language.location_management.place_id')
      .when('/:language/location_management/:place_id/edit_place', 'language.location_management.place_id.edit_place')
      .when('/:language/location_management/:place_id/add_poi', 'language.location_management.place_id.add_poi')
      .when('/:language/location_management/:place_id/:poi_id', 'language.location_management.place_id.poi_id')
      .when('/:language/location_management/:place_id/:poi_id/edit_poi', 'language.location_management.place_id.poi_id.edit_poi')
      .when('/:language/local_ecosystem', 'language.local_ecosystem')
      .when('/:language/local_ecosystem/add_local', 'language.local_ecosystem.add_local')
      .when('/:language/local_ecosystem/:type_id', 'language.local_ecosystem.type_id')
      .when('/:language/local_ecosystem/:type_id/:subtype_id', 'language.local_ecosystem.type_id.subtype_id')
      .when('/:language/local_ecosystem/:type_id/:subtype_id/:local_id', 'language.local_ecosystem.type_id.subtype_id.local_id')
      .when('/:language/local_ecosystem/:type_id/:subtype_id/:local_id/edit_local', 'language.local_ecosystem.type_id.subtype_id.local_id.edit_local')
      .when('/:language/local_ecosystem/:type_id/:subtype_id/:local_id/upload_video', 'language.local_ecosystem.type_id.subtype_id.local_id.upload_video')
      .when('/:language/tutorials', 'language.tutorials')
      .when('/:language/upload', 'language.upload')
      .when('/:language/users', 'language.users')

      .segment('language', {
        dependencies: ['language']
      })

      .within()

      .segment('login', {
        templateUrl: 'views/login.html',
        controller: 'loginCtrl',
        controllerAs: 'login'
      })

      .segment('new_user', {
        templateUrl: 'views/new-user.html',
        controller: 'newUserCtrl',
        controllerAs: 'newUser'
      })

      .segment('terms', {
        templateUrl: 'views/terms.html',
        controller: 'termsCtrl',
        controllerAs: 'terms'
      })

      .segment('survey', {
        templateUrl: 'views/survey.html',
        controller: 'surveyCtrl',
        controllerAs: 'survey'
      })

      .segment('home', {
        templateUrl: 'views/home.html',
        controller: 'homeCtrl',
        controllerAs: 'home'
      })

      .within()

      .segment('location', {
        templateUrl: 'views/video-location.html',
        controller: 'videoLocationCtrl',
        controllerAs: 'videoLocation'
      })

      .within()

      .segment('place_id', {
        dependencies: ['place_id']
      })

      .within()

      .segment('poi_id', {
        dependencies: ['poi_id']
      })

      .within()

      .segment('video_id', {
        dependencies: ['video_id']
      })

      .up()
      .up()
      .up()

      .segment('place_id', {
        templateUrl: 'views/video-place.html',
        controller: 'videoPlaceCtrl',
        controllerAs: 'videoPlace',
        dependencies: ['place_id']
      })

      .within()

      .segment('poi_id', {
        templateUrl: 'views/video-poi.html',
        controller: 'videoPoiCtrl',
        controllerAs: 'videoPoi',
        dependencies: ['poi_id']
      })

      .within()

      .segment('video_id', {
        templateUrl: 'views/single-video.html',
        controller: 'singleVideoCtrl',
        controllerAs: 'singleVideo',
        dependencies: ['video_id']
      })

      .up()
      .up()
      .up()

      .segment('profile', {
        templateUrl: 'views/profile.html',
        controller: 'profileCtrl',
        controllerAs: 'profile'
      })

      .within()

      .segment('location', {
        templateUrl: 'views/profile-location.html',
        controller: 'profileLocationCtrl',
        controllerAs: 'profileLocation'
      })

      .within()

      .segment('video_id', {
        dependencies: ['video_id']
      })

      .up()
      .up()

      .segment('walks', {
        templateUrl: 'views/walks.html',
        controller: 'walksCtrl',
        controllerAs: 'walks'
      })

      .within()

      .segment('location', {
        templateUrl: 'views/walk-location.html',
        controller: 'walkLocationCtrl',
        controllerAs: 'walkLocation'
      })

      .within()

      .segment('place_id', {
        dependencies: ['place_id']
      })

      .within()

      .segment('poi_id', {
        dependencies: ['poi_id']
      })

      .within()

      .segment('walk_id', {
        dependencies: ['walk_id']
      })

      .up()
      .up()
      .up()

      .segment('place_id', {
        templateUrl: 'views/walk-place.html',
        controller: 'walkPlaceCtrl',
        controllerAs: 'walkPlace',
        dependencies: ['place_id']
      })

      .within()

      .segment('poi_id', {
        templateUrl: 'views/walk-poi.html',
        controller: 'walkPoiCtrl',
        controllerAs: 'walkPoi',
        dependencies: ['poi_id']
      })

      .within()

      .segment('walk_id', {
        templateUrl: 'views/single-walk.html',
        controller: 'singleWalkCtrl',
        controllerAs: 'singleWalk',
        dependencies: ['walk_id']
      })

      .up()
      .up()
      .up()

      .segment('add_walk', {
        templateUrl: 'views/add-walk.html',
        controller: 'addWalkCtrl',
        controllerAs: 'addWalk'
      })

      .segment('location_management', {
        templateUrl: 'views/location-management.html',
        controller: 'locationManagementCtrl',
        controllerAs: 'locationManagement'
      })

      .within()

      .segment('add_place', {
        templateUrl: 'views/add-place.html',
        controller: 'addPlaceCtrl',
        controllerAs: 'addPlace'
      })

      .segment('place_id', {
        dependencies: ['place_id']
      })

      .within()

      .segment('edit_place', {
        templateUrl: 'views/edit-place.html',
        controller: 'editPlaceCtrl',
        controllerAs: 'editPlace'
      })

      .segment('add_poi', {
        templateUrl: 'views/add-poi.html',
        controller: 'addPoiCtrl',
        controllerAs: 'addPoi'
      })

      .segment('poi_id', {
        dependencies: ['poi_id']
      })

      .within()

      .segment('edit_poi', {
        templateUrl: 'views/edit-poi.html',
        controller: 'editPoiCtrl',
        controllerAs: 'editPoi'
      })

      .up()
      .up()
      .up()

      .segment('local_ecosystem', {
        templateUrl: 'views/local-ecosystem-location.html',
        controller: 'localEcosystemLocationCtrl',
        controllerAs: 'localEcosystemLocation'
      })

      .within()

      .segment('add_local', {
        templateUrl: 'views/add-local.html',
        controller: 'addLocalCtrl',
        controllerAs: 'addLocal'
      })

      .segment('type_id', {
        dependencies: ['type_id']
      })

      .within()

      .segment('subtype_id', {
        dependencies: ['subtype_id']
      })

      .within()

      .segment('local_id', {
        templateUrl: 'views/single-local-ecosystem.html',
        controller: 'singleLocalCtrl',
        controllerAs: 'singleLocal',
        dependencies: ['local_id']
      })

      .within()

      .segment('edit_local', {
        templateUrl: 'views/edit-local.html',
        controller: 'editLocalCtrl',
        controllerAs: 'editLocal'
      })

      .segment('upload_video', {
        templateUrl: 'views/upload-video-answer.html',
        controller: 'uploadVideoAnswerCtrl',
        controllerAs: 'uploadVideoAnswer'
      })

      .up()
      .up()
      .up()
      .up()

      .segment('tutorials', {
        templateUrl: 'views/tutorials.html',
        controller: 'tutorialsCtrl',
        controllerAs: 'tutorials'
      })

      .segment('upload', {
        templateUrl: 'views/upload.html',
        controller: 'uploadCtrl',
        controllerAs: 'upload'
      })

      .segment('users', {
        templateUrl: 'views/users.html',
        controller: 'usersCtrl',
        controllerAs: 'users'
      });

    $routeProvider.otherwise({redirectTo: '/en/login'});

    $qProvider.errorOnUnhandledRejections(false);

  }]);
