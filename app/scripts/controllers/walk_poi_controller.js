'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.controller('walkPoiCtrl', ['rootService', '$location', 'userServiceData', 'walkService', 'walkServiceData', 'locationService', 'locationServiceData', '$routeParams', '$scope', '$timeout',
  function (rootService, $location, userServiceData, walkService, walkServiceData, locationService, locationServiceData, $routeParams, $scope, $timeout) {

    var vm = this;

    vm.rootService = rootService;
    vm.userServiceData = userServiceData;
    vm.walkServiceData = walkServiceData;
    vm.walkService = walkService;
    vm.walkCities = [];
    vm.headerTitle = '';

    // walkService.getWalkByPlaceId($routeParams.place_id);

    function getUser () {
      return userServiceData.users;
    }
    getUser();

    function getWalks() {
      vm.walksFiltered = walkServiceData.walkListByPoi;
      return vm.walksFiltered;
    }

    function updateTitle() {
      vm.headerTitle = vm.walksFiltered[0].address;
      walkService.selectCity = vm.headerTitle;
      return vm.headerTitle;
    }

    if (userServiceData.users.admin === true) {
      vm.padding = '100px 20px 80px 20px !important';
    } else {
      vm.padding = '100px 20px 0 20px !important';
    }

    vm.getDate = function (date) {
      var dateTransformed = new Date(date);
      return dateTransformed;
    };

    vm.getParticipants = function (walk_id) {
      walkService.getWalkByIdParticipants(walk_id);
    };

    function getParticipantData() {
      vm.participants = walkServiceData.walkListByIdParticipants;
      return vm.participants;
    }

    vm.getAge = function (date) {
      return Math.floor((new Date() - new Date(date).getTime()) / 3.15576e+10)
    };

    function checkUserIsSubscribed() {
      var index = 0;
      vm.walksFiltered.forEach(function (walk) {
        walk.subscription = false;
        while (index < walk.participants.length) {
          if (walk.participants[index] === userServiceData.users.id) {
            walk.subscription = true;
            break;
          }
          index++;
        }
      });
    };

    vm.signUpWalk = function(walk_id) {
      vm.openMessageWindow = false;

      var user = {
        user_id: userServiceData.users.id,
      };

      walkService.putParticipantToWalk(user, walk_id);

      vm.successMessage = 'You are subscribe to the walk successfully!';
      vm.openMessageWindow = true;
      vm.successUpload = true;

      $timeout(function quitPopup() {
        vm.openMessageWindow = false;
      });

    };

    vm.deleteWalk = function (walk_id) {
      walkService.deleteWalk(walk_id);
    };

    vm.goToAddWalk = function () {
      $location.path('/' + $routeParams.language +'/add_walk');
    };

    vm.goToLocationWalk = function (place_id, walk_id) {
      walkService.selectCity = '';
      $routeParams.poi_id = place_id;
      $routeParams.walk_id = walk_id;
      $location.path( '/'+ $routeParams.language + '/walks/location/' + $routeParams.place_id + '/' + $routeParams.poi_id + '/' + $routeParams.walk_id);
    };

    vm.goToSingleWalk = function (place_id, walk_id) {
      $routeParams.poi_id = place_id;
      $routeParams.walk_id = walk_id;
      $location.path('/'+ $routeParams.language + '/walks/' + $routeParams.place_id + '/' + $routeParams.poi_id + '/' + $routeParams.walk_id);
    };

    vm.backToWalks = function () {
      $location.path('/' + $routeParams.language +'/walks');
    };

    vm.goToUpload = function () {
      $location.path('/' + $routeParams.language + '/upload');
    };

    vm.downloadPDF = function (walk) {

      console.log(walk);

      var participantArray = [];

      vm.participants.forEach(function (participant) {
        var participantData = [];
        var participantName = {text: participant.name};
        var participantMail = {text: participant.email};
        var participantAge = {text: vm.getAge(participant.birth_date)};

        participantData = [participantName, participantMail, participantAge];

        participantArray.push(participantData);
      });

      var docDefinition = {
        header: function() {
          return [
            {
              style: 'table',
              margin: [62,35,62,35],
              table: {
                widths: ['*'],
                headerRows: 0,
                body: [
                  [
                    {text: 'Walk a Story - Caminata ' + walk.title + ' - Participants', style: 'topHeader', alignment: 'left'},
                    // {
                    //   image: 'data:image/png;base64,' + LOGO_BASE64,
                    //   width: 150,
                    //   alignment: 'right'
                    // }
                  ]
                ]
              },
              layout: 'noBorders'
            }
          ]
        },
        footer: function(currentPage, pageCount) {
          return [
            {text: currentPage.toString() + ' of ' + pageCount, alignment: 'center', style: 'footer'}
          ]
        },
        content: [
          {
            style: 'topTable',
            table: {
              widths: ['*','*', '*'],
              heights: [18],
              headerRows: 1,
              body: [
                [
                  {text: 'Participant', style: 'tableHeader'},
                  {text: 'Mail', style: 'tableHeader'},
                  {text: 'Age', style: 'tableHeader'}
                ]
              ]
            },
            layout: {
              paddingLeft: function(i, node) { return 8; },
              paddingRight: function(i, node) { return 8; },
              paddingTop: function(i, node) { return 6; },
              paddingBottom: function(i, node) { return 6; },
              fillColor: function (i, node) {
                return (i % 2 === 0) ?  '#F5F5F5' : null;
              }
            }
          }
        ],
        pageSize: 'A4',
        pageMargins: [62,80,62,80],
        styles: {
          topHeader: {
            fontSize: 20,
            bold: true,
            margin: [0, 6, 0, 30],
            alignment: 'left',
            color: '#249191'
          },
          table: {
            fontSize: 8,
            alignment: 'left',
            color: 'black',
            margin: [0, 5, 0, 15]
          },
          header: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 15],
            alignment: 'left'
          },
          footer: {
            fontSize: 8,
            margin: [0, 25, 0, 17],
            alignment: 'center'
          }
        }
      };

      participantArray.forEach(function (participantRow) {
        docDefinition.content[0].table.body.push(participantRow);
      });

      pdfMake.createPdf(docDefinition).download();

    };

    vm.getPoiName = function() {
      vm.poiList = locationServiceData.poisListById;
      vm.headerTitle = vm.poiList.name;
    };

    function initWatchers() {

      vm.walkWatcher = $scope.$watch(
        function () {
          return walkService.walkListByPoiLoaded;
        }, function (newValue) {
          if (newValue === true) {
            getWalks();
            updateTitle();
            checkUserIsSubscribed();
            walkService.walkListByPoiLoaded = false;
          }
        }
      );

      vm.participantsWatcher = $scope.$watch(
        function () {
          return walkService.poiParticipantsLoaded;
        }, function (newValue) {
          if (newValue === true) {
            getParticipantData();
            walkService.poiParticipantsLoaded = false;
          }
        }
      );

      vm.loadPoiByIdWatcher = $scope.$watch(
        function () {
          return locationService.poiByIdLoaded;
        }, function (newValue) {

          if (newValue === true) {
            vm.getPoiName();
            locationService.poiByIdLoaded = false;
          }
        }
      );

    }
    initWatchers();

}]);
