'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.controller('singleWalkCtrl', ['rootService', '$location', 'userServiceData', 'walkService', 'walkServiceData', 'locationServiceData', '$routeParams', '$scope', '$timeout',
  function (rootService, $location, userServiceData, walkService, walkServiceData, locationServiceData, $routeParams, $scope, $timeout) {

  var vm = this;

  vm.rootService = rootService;
  vm.userServiceData = userServiceData;
  vm.walkServiceData = walkServiceData;
  vm.walkService = walkService;
  vm.walk = [];

  function getUser () {
    return userServiceData.users;
  }
  getUser();

  walkService.getWalkById($routeParams.walk_id);

  function getWalk() {
    vm.walk = walkServiceData.walkListById;
    return vm.walk;
  }

  function updateTitle() {
    locationServiceData.citiesList.forEach(function (city) {

      if (city.id === $routeParams.place_id) {
        city.points_of_interest.forEach(function (poi) {
          if ($routeParams.poi_id === poi.id) {
            vm.headerTitle = poi.name;
          }
        });
      }
    });
    return vm.headerTitle;
  }
  updateTitle();

  if (userServiceData.users.admin === true) {
    vm.padding = '100px 20px 80px 20px !important';
  } else {
    vm.padding = '100px 20px 0 20px !important';
  }

  vm.getDate = function (date) {
    var dateTransformed = new Date(date);
    return dateTransformed;
  };

  vm.getParticipants = function () {
    walkService.getWalkByIdParticipants($routeParams.walk_id);
  };
  vm.getParticipants();

  function getParticipantData() {
    vm.participants = walkServiceData.walkListByIdParticipants;
    return vm.participants;
  }
  // getParticipantData();

  vm.getAge = function (date) {
    return Math.floor((new Date() - new Date(date).getTime()) / 3.15576e+10)
  };

  function checkUserIsSubscribed() {
      var index = 0;
      vm.walk.subscription = false;
      while (index < vm.walk.participants.length) {
        if (vm.walk.participants[index] === userServiceData.users.id) {
          vm.walk.subscription = true;
          break;
        }
        index++;
      }
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
    $location.path('/' + $routeParams.language + '/add_walk');
  };

  vm.goToLocationWalk = function (place_id, walk_id) {
    walkService.selectCity = '';
    $routeParams.place_id = place_id;
    $routeParams.walk_id = walk_id;
    $location.path('/' + $routeParams.language + '/walks/location/' + $routeParams.place_id + '/' + $routeParams.walk_id);
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

    function initWatchers() {

      vm.walkWatcher = $scope.$watch(
        function () {
          return walkService.walkByIdLoaded;
        }, function (newValue) {
          if (newValue === true) {
            getWalk();
            checkUserIsSubscribed();
            walkService.walkByIdLoaded = false;
          }
        }
      );

      vm.participantsWatcher = $scope.$watch(
        function () {
          return walkService.singleParticipantsLoaded;
        }, function (newValue) {
          if (newValue === true) {
            getParticipantData();
            walkService.singleParticipantsLoaded = false;
          }
        }
      );

    }
    initWatchers();

}]);
