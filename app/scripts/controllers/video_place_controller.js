'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.controller('videoPlaceCtrl', ['rootService', 'videoService', 'videoServiceData', 'locationServiceData', 'locationService', 'userServiceData', 'commentsService', 'commentsServiceData', 'ratingService', 'ratingServiceData', '$timeout', '$routeParams', '$location', '$scope',
  function (rootService, videoService, videoServiceData,locationServiceData, locationService, userServiceData, commentsService, commentsServiceData, ratingService, ratingServiceData, $timeout, $routeParams, $location, $scope) {

  var vm = this;

  vm.rootService = rootService;
  vm.userServiceData = userServiceData;
  vm.videoServiceData = videoServiceData;
  vm.videoService = videoService;
  vm.locationServiceData = locationServiceData;
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
  vm.videosFiltered = [];
  vm.cities = [];

  videoService.getVideoListByPlace($routeParams.place_id);
  commentsService.getComments();

  locationService.getCitiesById($routeParams.place_id);

  vm.getUser = function () {
    return userServiceData.users;
  };

  console.log(userServiceData.users);

  function getVideos() {

    if (userServiceData.users.admin === true) {

      console.log(videoServiceData.videoListByPlace);
      vm.videosFiltered = videoServiceData.videoListByPlace;
      return vm.videosFiltered;

    } else if (userServiceData.users.admin === false) {
      vm.videosFiltered = videoServiceData.videoListByPlace.filter(function (video) {

        console.log(vm.videosFiltered);
        return video.file_public === true;

      });

      return vm.videosFiltered;
    }

  }

  vm.deleteVideo = function (videoId) {
    videoService.deleteVideo(videoId);
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

  vm.voteVideo = function (videoId, value) {

    var rating = {
      video_id: videoId,
      user_id: userServiceData.users.id,
      value: value
    };

    ratingService.addRatingVoteToVideo(rating);

  };

  function updateRating() {

    if (videoServiceData.videoListByPlace.videos !== undefined) {
      videoServiceData.videoListByPlace.videos.forEach(function (video) {
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

  vm.toggleComments = function (video_id) {
    videoServiceData.videoListByPlace.videos.forEach(function (video) {
      if(video.id === video_id) {
        vm.openComments[video.id] = !vm.openComments[video.id];
      } else {
        vm.openComments[video.id] = false;
      }
    });
  };

  vm.getComments = function (id) {

    console.log(commentsServiceData.commentsList);
    vm.comments = [];

    //TODO La fecha no corresponde con la zona horaria
    commentsServiceData.commentsList.forEach(function (comment) {
      if(comment.video_id === id) {
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

  vm.addComment = function (id) {

    var date = new Date();
    var utcDate = date.toUTCString();

    var newComment = {
      video_id: id,
      user_id: userServiceData.users.id,
      username: userServiceData.users.name,
      date: utcDate,
      text: vm.comment[id],
      status: 0
    };

    commentsService.addComment(newComment);

    vm.comment[id] = '';
    vm.openComments[id] = false;
    vm.toggleComments(id);
    commentsService.commentVideoId = id;

  };

  vm.voteComment = function (commentId, value, videoId) {

    var rating = {
      comment_id: commentId,
      user_id: userServiceData.users.id,
      value: value
    };

    commentsService.commentVideoId = videoId;
    ratingService.addRatingVoteToComment(rating);

  };

  vm.flagComment = function (videoId, commentId) {

    vm.flagVideoId = videoId;

    commentsServiceData.commentsList.forEach(function (comment) {
      if(comment.comment_id === commentId) {
        vm.flagCommentSelected = {
          id: comment.comment_id,
          user: comment.username,
          text: comment.text
        };
      }
    });

    commentsService.commentVideoId = videoId;
    vm.openFlagPopup[videoId] = true;

  };

  vm.addReportToComment = function (commentId) {

    var report = {
      comment_id: commentId,
      user_id: userServiceData.users.id
    };

    ratingService.addRatingReportToComment(report);

  };

  vm.openDeleteComment = function (videoId, commentId) {
    vm.deleteVideoId = videoId;

    commentsServiceData.commentsList.forEach(function (comment) {
      if(comment.comment_id === commentId) {
        vm.deleteCommentSelected = {
          id: comment.comment_id,
          user: comment.username,
          text: comment.text
        }
      }
    });

    vm.openDeleteCommentPopup[videoId] = true;

  };

  vm.deleteComment = function (id) {

    commentsService.deleteComment(id);

    vm.getComments();
  };

  vm.goToSingleVideo = function (place_id, video_id) {
    $routeParams.poi_id = place_id;
    $routeParams.video_id = video_id;
    $location.path('/' + $routeParams.language + '/home/' + $routeParams.place_id + '/' + $routeParams.poi_id + '/' + $routeParams.video_id);
  };

  vm.goToLocationVideo = function (place_id, video_id) {
    videoService.selectCity = '';
    $routeParams.poi_id = place_id;
    $routeParams.video_id = video_id;
    $location.path('/' + $routeParams.language + '/home/location/' + $routeParams.place_id + '/' + $routeParams.poi_id + '/' + $routeParams.video_id);
  };

  vm.goToUpload = function () {
    $location.path('/' + $routeParams.language + '/upload');
  };

  vm.getCityName = function() {
    vm.citiesList = locationServiceData.cityListById;
    vm.headerTitle = vm.citiesList.name;
  };

  function initWatchers() {

    vm.videoWatcher = $scope.$watch(
      function () {
        return videoService.videosByPlaceLoaded;
      }, function (newValue) {
        if (newValue === true) {
          updateRating();
          getVideos();
          videoService.videosByPlaceLoaded = false;
        }
      }
    );

    vm.ratingWatcher = $scope.$watch(
      function () {
        return ratingService.ratingUpdated;
      }, function (newValue) {
        if (newValue === true) {
          videoService.getVideoListByPlace($routeParams.place_id);
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
    vm.loadCitiesByIdWatcher = $scope.$watch(
      function () {
        return locationService.cityByIdLoaded;
      }, function (newValue) {

        if (newValue === true) {
          vm.getCityName();
          locationService.cityByIdLoaded = false;
        }
      }
    );


  }
  initWatchers();

}]);
