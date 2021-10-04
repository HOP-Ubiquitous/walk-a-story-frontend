'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.controller('singleLocalCtrl', ['rootService', 'videoService', 'videoServiceData', 'localEcosystemService', 'localEcosystemServiceData', 'userServiceData', 'commentsService', 'commentsServiceData', 'ratingService', 'ratingServiceData', 'locationServiceData', '$timeout', '$routeParams', '$location', '$scope', '$q',
  function (rootService, videoService, videoServiceData, localEcosystemService, localEcosystemServiceData, userServiceData, commentsService, commentsServiceData, ratingService, ratingServiceData, locationServiceData, $timeout, $routeParams, $location, $scope, $q) {

  var vm = this;

  vm.rootService = rootService;
  vm.userServiceData = userServiceData;
  vm.localEcosystemServiceData = localEcosystemServiceData;
  vm.localEcosystemService = localEcosystemService;
  vm.comment = [];
  vm.openComments = [];
  vm.showedComments = [];
  vm.commentVoteColor = [];
  vm.commentVoteArrow = [];
  vm.openFlagPopup = [];
  vm.openDeleteCommentPopup = [];
  vm.positive = [];
  vm.negative = [];
  vm.ratingNumber = [];
  vm.ratingArray = [];
  vm.localSelected = {};
  vm.cities = [];

  vm.getUser = function () {
    return userServiceData.users;
  };

  console.log(userServiceData.users);

  localEcosystemService.getLocalById($routeParams.local_id);

  function getLocal() {
    vm.localSelected = localEcosystemServiceData.localById;
    return vm.localSelected;
  }

  function getVideoId() {
    vm.videoSelected = videoServiceData.videoById;
    return vm.videoSelected;
  }

  function getVideoPlaceId() {
    vm.videoPlace = videoServiceData.videoListByPoi.videos;
    console.log(vm.videoPlace);
    return vm.videoPlace;
  }

  commentsService.getComments();

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

  vm.deleteVideo = function (video_id) {
    localEcosystemService.deleteVideo(video_id);
  };

  vm.privateVideo = function (video) {

    var dataVideo = {
      username: video.username,
      name: video.username,
      mail: userServiceData.users.email,
      title: video.title,
      description: video.description,
      videoId: video.id,
      point: video.place_id
    };

    videoService.privateVideo(dataVideo, video.id);
  };

  vm.publishVideo = function (video) {

    var dataVideo = {
      username: video.username,
      name: video.username,
      mail: userServiceData.users.email,
      title: video.title,
      description: video.description,
      videoId: video.id,
      point: video.place_id
    };

    videoService.publishVideo(dataVideo, video.id);
  };

  vm.undeleteVideo = function (video) {

    var dataVideo = {
      username: video.username,
      name: video.username,
      mail: userServiceData.users.email,
      title: video.title,
      description: video.description,
      videoId: video.id,
      point: video.place_id
    };

    videoService.undeleteVideo(dataVideo, video.id);
  };

  vm.voteVideo = function (video_id, value) {

    var rating = {
      video_id: video_id,
      user_id: userServiceData.users.id,
      value: value
    };

    ratingService.addRatingVoteToVideo(rating);

  };

  function updateRating() {

    if (videoService.videoById !== undefined) {

      videoService.videoById.forEach(function (video) {

        vm.positive[video.id] = video.positive_votes;
        vm.negative[video.id] = video.negative_votes;

        if (vm.positive[video.id] !== undefined || vm.negative[video.id] !== undefined) {
          vm.ratingNumber[video.id] = (Math.round((((vm.positive[video.id] - vm.negative[video.id]) * 7.5) / vm.positive[video.id]) * 2) / 2);
        }

        if (vm.positive[video.id] === 0 && vm.negative[video.id] === 0) {
          vm.ratingNumber[video.id] = 2.5;
        }

        if (vm.positive[video.id] - vm.negative[video.id] === 0) {
          vm.ratingNumber[video.id] = 2.5;
        }

        if (vm.ratingNumber[video.id] < 0) {
          vm.ratingNumber[video.id] = 0;
        }

        if (vm.ratingNumber[video.id] > 5) {
          vm.ratingNumber[video.id] = 5;
        }

        console.log(vm.ratingNumber[video.id]);

        vm.ratingArray[video.id] = [
          {'star': 'far fa-star'},
          {'star': 'far fa-star'},
          {'star': 'far fa-star'},
          {'star': 'far fa-star'},
          {'star': 'far fa-star'}
        ];

        if (Number.isInteger(vm.ratingNumber[video.id]) === true) {
          for (var i = 0; i < vm.ratingNumber[video.id]; i++) {
            vm.ratingArray[video.id][i].star = 'fas fa-star';
          }
          console.log(vm.ratingArray[video.id]);
        } else {
          var integerRating = Math.round(vm.ratingNumber[video.id]);

          for (var i = 0; i < integerRating - 1; i++) {
            vm.ratingArray[video.id][i].star = 'fas fa-star';
          }

          if (vm.ratingArray[video.id] !== undefined) {
            vm.ratingArray[video.id][integerRating - 1].star = 'fas fa-star-half-alt';
          }
        }

      });

    }
  }

  updateRating();

  vm.toggleComments = function (video_id) {
    vm.openComments[video_id] = !vm.openComments[video_id];
  };

  vm.getComments = function (video_id) {

    console.log(commentsServiceData.commentsList);
    vm.comments = [];

    //TODO La fecha no corresponde con la zona horaria
    commentsServiceData.commentsList.forEach(function (comment) {
      if(comment.video_id === video_id) {
        var date = new Date(comment.date);
        comment.date = date;

        var votes = comment.positive_votes - comment.negative_votes;

        if (votes > 0) {
          vm.commentVoteColor[comment.comment_id] = '#249191';
          vm.commentVoteArrow[comment.comment_id] = 'fas fa-arrow-alt-circle-up';
        } else if (votes === 0) {
          vm.commentVoteColor[comment.comment_id] = '#edac15';
          vm.commentVoteArrow[comment.comment_id] = 'fas fa-arrow-alt-circle-right';
        } else {
          vm.commentVoteColor[comment.comment_id] = '#dc3545';
          vm.commentVoteArrow[comment.comment_id] = 'fas fa-arrow-alt-circle-down';
        }

        vm.comments.push(comment);

      }

    });

    return vm.comments;

  };

  vm.addComment = function (video_id) {

    var date = new Date();
    var utcDate = date.toUTCString();

    var newComment = {
      video_id: video_id,
      user_id: userServiceData.users.id,
      username: userServiceData.users.name,
      date: utcDate,
      text: vm.comment[video_id],
      status: 0
    };

    commentsService.addComment(newComment);

    vm.comment[video_id] = '';
    vm.openComments[video_id] = true;
    commentsService.commentVideoId = video_id;

  };

  vm.voteComment = function (comment_id, value, video_id) {

    var rating = {
      comment_id: comment_id,
      user_id: userServiceData.users.id,
      value: value
    };

    commentsService.commentVideoId = video_id;
    ratingService.addRatingVoteToComment(rating);

  };

  vm.flagComment = function (video_id, comment_id) {

    vm.flagVideoId = video_id;

    commentsServiceData.commentsList.forEach(function (comment) {
      if(comment.comment_id === comment_id) {
        vm.flagCommentSelected = {
          id: comment.comment_id,
          user: comment.username,
          text: comment.text
        };
      }
    });

    commentsService.commentVideoId = video_id;
    vm.openFlagPopup[video_id] = true;

  };

  vm.addReportToComment = function (comment_id) {

    var report = {
      comment_id: comment_id,
      user_id: userServiceData.users.id
    };

    ratingService.addRatingReportToComment(report);

  };

  vm.openDeleteComment = function (video_id, comment_id) {
    vm.deleteVideoId = video_id;

    commentsServiceData.commentsList.forEach(function (comment) {
      if(comment.comment_id === comment_id) {
        vm.deleteCommentSelected = {
          id: comment.comment_id,
          user: comment.username,
          text: comment.text
        }
      }
    });

    vm.openDeleteCommentPopup[video_id] = true;

  };

  //TODO Revisar esta función
  vm.deleteComment = function (id) {

    commentsService.deleteComment(id);

    vm.getComments();
  };

  vm.goToLocationVideo = function (place_id, video_id) {
    localEcosystemService.selectCity = '';
    $routeParams.poi_id = place_id;
    $routeParams.video_id = video_id;
    $location.path('/' + $routeParams.language + '/home/location/' + $routeParams.place_id + '/' + $routeParams.poi_id + '/' + $routeParams.video_id);
  };

  vm.goToUpload = function () {
    $location.path('/' + $routeParams.language + '/upload');
  }

  vm.goToAddVideoComment = function () {
    $location.path('/' + $routeParams.language + '/local_ecosystem/' + $routeParams.type_id + '/' + $routeParams.subtype_id + '/' + $routeParams.local_id + '/upload_video');
  };

  vm.setActive = function (id) {
    localEcosystemService.setLocalActive(id);
  };

  vm.setInactive = function (id) {
    localEcosystemService.setLocalInactive(id);
  };

  vm.goToEditLocal = function () {
    $location.path('/' + $routeParams.language + '/local_ecosystem/' + $routeParams.type_id + '/' + $routeParams.subtype_id + '/' + $routeParams.local_id + '/edit_local');
  };

    function initWatchers() {

      vm.videoWatcher = $scope.$watch(
        function () {
          return videoService.videoByIdLoaded;
        }, function (newValue) {
          if (newValue === true) {
            getVideoId();
            updateRating();
            videoService.videoByIdLoaded = false;
          }
        }
      );

      vm.videoWatcher = $scope.$watch(
        function () {
          return videoService.videosByPoiLoaded;
        }, function (newValue) {
          if (newValue === true) {
            getVideoPlaceId();
            updateRating();
            videoService.videosByPoiLoaded = false;
          }
        }
      );

      vm.ratingWatcher = $scope.$watch(
        function () {
          return ratingService.ratingUpdated;
        }, function (newValue) {
          if (newValue === true) {
            // videoService.getVideoById($routeParams.video_id);
            localEcosystemService.localsByIdLoaded = true;
            ratingService.ratingUpdated = false;
          }
        }
      );

      vm.commentsWatcher = $scope.$watch(
        function () {
          return commentsService.commentsLoaded;
        }, function (newValue) {
          if (newValue === true) {
            vm.getComments(commentsService.commentVideoId);
            commentsService.commentsLoaded = false;
          }
        }
      );

      vm.ratingCommentsWatcher = $scope.$watch(
        function () {
          return ratingService.commentRatingUpdated;
        }, function (newValue) {
          if (newValue === true) {
            videoService.getVideoList();
            ratingService.commentRatingUpdated = false;
          }
        }
      );

      vm.reportCommentsWatcher = $scope.$watch(
        function () {
          return ratingService.commentReportUpdated;
        }, function (newValue) {
          if (newValue === true) {
            videoService.getVideoList(localEcosystemServiceData.localById.mainVideoId);
            ratingService.commentReportUpdated = false;
          }
        }
      );

      vm.localWatcher = $scope.$watch(
        function () {
          return localEcosystemService.localsByIdLoaded;
        }, function (newValue) {
          if (newValue === true) {
            getLocal();
            videoService.getVideoById(localEcosystemServiceData.localById.mainVideoId);
            videoService.getVideoListByPoiId(localEcosystemServiceData.localById.id);
            localEcosystemService.localsByIdLoaded = false;
          }
        }
      );

    }
    initWatchers();

}]);
