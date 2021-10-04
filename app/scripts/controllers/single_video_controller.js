'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.controller('singleVideoCtrl', ['rootService', 'videoService', 'videoServiceData', 'userServiceData', 'commentsService', 'commentsServiceData', 'ratingService', 'ratingServiceData', 'locationServiceData', '$timeout', '$routeParams', '$location', '$scope',
  function (rootService, videoService, videoServiceData, userServiceData, commentsService, commentsServiceData, ratingService, ratingServiceData, locationServiceData, $timeout, $routeParams, $location, $scope) {

  var vm = this;

  vm.rootService = rootService;
  vm.userServiceData = userServiceData;
  vm.videoServiceData = videoServiceData;
  vm.videoService = videoService;
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
  vm.videoSelected = {};
  vm.cities = [];

  videoService.getVideoById($routeParams.video_id);
  commentsService.getComments();

  vm.getUser = function () {
    return userServiceData.users;
  };

  console.log(userServiceData.users);

  function getVideo() {

    console.log(videoServiceData.videoById);
    vm.videoSelected = videoServiceData.videoById;
    return vm.videoSelected;
  }
  getVideo();

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
    videoService.deleteVideo(video_id);
  };

  vm.privateVideo = function (video) {

    var dataVideo = {
      username: video.name,
      name: video.name,
      mail: video.mail,
      title: video.title,
      description: video.description,
      videoId: video.id,
      point: video.point
    };

    videoService.privateVideo(dataVideo, video.id);
  };

  vm.publishVideo = function (video) {

    var dataVideo = {
      username: video.name,
      name: video.name,
      mail: video.mail,
      title: video.title,
      description: video.description,
      videoId: video.id,
      point: video.point
    };

    videoService.publishVideo(dataVideo, video.id);
  };

  vm.undeleteVideo = function (video) {

    var dataVideo = {
      username: video.name,
      name: video.name,
      mail: video.mail,
      title: video.title,
      description: video.description,
      videoId: video.id,
      point: video.point
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

    if (videoServiceData.videoById !== undefined) {

      videoServiceData.videoById.forEach(function (video) {

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
    videoService.selectCity = '';
    $routeParams.poi_id = place_id;
    $routeParams.video_id = video_id;
    $location.path('/' + $routeParams.language + '/home/location/' + $routeParams.place_id + '/' + $routeParams.poi_id + '/' + $routeParams.video_id);
  };

  vm.goToUpload = function () {
    $location.path('/' + $routeParams.language + '/upload');
  }

  function initWatchers() {

    vm.videoWatcher = $scope.$watch(
      function () {
        return videoService.videoByIdLoaded;
      }, function (newValue) {
        if (newValue === true) {
          getVideo();
          updateRating();
          videoService.videoByIdLoaded = false;
        }
      }
    );

    vm.ratingWatcher = $scope.$watch(
      function () {
        return ratingService.ratingUpdated;
      }, function (newValue) {
        if (newValue === true) {
          videoService.getVideoById($routeParams.video_id);
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
          videoService.getVideoList();
          ratingService.commentReportUpdated = false;
        }
      }
    );

  }
  initWatchers();

}]);
