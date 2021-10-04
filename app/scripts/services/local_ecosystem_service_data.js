'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.service('localEcosystemServiceData', [ function() {

  var localEcosystemService = {};

  localEcosystemService.typeList = [
    {
      "name" : "Events",
      "subtypes" : [
        {"name": "Concert"},
        {"name": "Congress"},
        {"name": "Party"},
        {"name": "Sport Event"},
        {"name": "Theater play"}
      ]
    },
    {
      "name" : "HORECA",
      "subtypes" : [
        {"name": "Hotel"},
        {"name": "Hostel"},
        {"name": "Cafe"},
        {"name": "Restaurant"},
        {"name": "Bar"},
        {"name": "Pub"},
        {"name": "Disco"}
      ]
    },
    {
      "name" : "Sports associations",
      "subtypes" : [
        {"name": "Club"},
        {"name": "Team"},
        {"name": "Stadium"},
        {"name": "Building"},
        {"name": "Gym"},
        {"name": "Pool"}
      ]
    },
    {
      "name" : "Tourism",
      "subtypes" : [
        {"name": "Museum"},
        {"name": "Route"},
        {"name": "Guide"},
        {"name": "Shop"}
      ]
    }
  ];

  localEcosystemService.localList = [];
  localEcosystemService.localById = [];
  localEcosystemService.localsByType = [];
  localEcosystemService.localsByOwnerId = [];

  return localEcosystemService;

}]);
