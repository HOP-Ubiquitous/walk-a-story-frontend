'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.controller('profileCtrl',[ 'rootService', 'videoService', 'videoServiceData', 'userServiceData', 'ratingService', 'ratingServiceData', '$scope', '$routeParams', '$location',
  function(rootService, videoService, videoServiceData, userServiceData, ratingService, ratingServiceData, $scope, $routeParams, $location) {

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

  function getUser () {
  return userServiceData.users;
  };

  getUser();

  videoService.getVideoListByUser(userServiceData.users.id);
  console.log(userServiceData.users);

  function getUserVideos() {
    vm.userVideos = videoServiceData.videoListByUser.videos;
    return vm.userVideos;
  }

  function initWatchers() {

    vm.videoWatcher = $scope.$watch(
      function () {
        return videoService.userVideosLoaded;
      }, function (newValue) {
        if (newValue === true) {
          getUserVideos();
          updateRating();
          videoService.userVideosLoaded = false;
        }
      }
    );

    vm.ratingWatcher = $scope.$watch(
      function () {
        return ratingService.ratingUpdated;
      }, function (newValue) {
        if (newValue === true) {
          videoService.getVideoListByUser(userServiceData.users.id);
          ratingService.ratingUpdated = false;
        }
      }
    );

  }
  initWatchers();

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

    updateRating();

  };

  function updateRating() {

    if (videoServiceData.videoListByUser.videos !== undefined) {
      videoServiceData.videoListByUser.videos.forEach(function (video) {
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

  var testId = function () {
    var idLength = 32;
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < idLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  vm.toggleComments = function (id) {
    vm.openComments[id] = !vm.openComments[id];
  };

  vm.getComments = function (id) {
    videoServiceData.comments.forEach(function (comment) {
      if (comment.id === id) {
        vm.showedComments[id] = comment.comments;

        comment.comments.forEach(function (singleComment) {
          if (singleComment.votes >= 0) {
            vm.commentVoteColor[singleComment.id] = '#249191';
            vm.commentVoteArrow[singleComment.id] = 'fas fa-long-arrow-alt-up';
          } else {
            vm.commentVoteColor[singleComment.id] = '#dc3545';
            vm.commentVoteArrow[singleComment.id] = 'fas fa-long-arrow-alt-down';
          }
        })
      }
    })
  };

  vm.addComment = function (id) {
    console.log(id);
    console.log(vm.comment);

    var newComment = {
      id: testId(),
      user: userServiceData.users.name,
      date: new Date(),
      text: vm.comment[id],
      votes: 0,
      reports: 0
    };

    videoServiceData.comments.forEach(function (comment) {
      if (comment.id === id) {
        comment.comments.push(newComment)
      }
    });

    vm.comment[id] = '';
    vm.openComments[id] = true;
    vm.getComments(id)

  };

  vm.plusVote = function (videoId, commentId) {
    videoServiceData.comments.forEach(function (comment) {
      comment.comments.forEach(function (singleComment) {
        if (singleComment.id === commentId) {
          singleComment.votes = singleComment.votes + 1;
        }
      })
    });

    vm.getComments(videoId);
  };

  vm.minusVote = function (videoId, commentId) {
    videoServiceData.comments.forEach(function (comment) {
      comment.comments.forEach(function (singleComment) {
        if (singleComment.id === commentId) {
          singleComment.votes = singleComment.votes - 1;
        }
      })
    });

    vm.getComments(videoId);
  };

  vm.flagComment = function (videoId, commentId) {
    vm.flagVideoId = videoId;
    videoServiceData.comments.forEach(function (comment) {
      comment.comments.forEach(function (singleComment, index) {
        if (singleComment.id === commentId) {
          vm.flagCommentSelected = singleComment;
          vm.indexCommentSelected = index;
          vm.openFlagPopup[comment.id] = true;
        }
      })
    });
  };

  vm.addFlag = function () {
    console.log(vm.flagVideoId);
    console.log(vm.flagCommentSelected);
    console.log(vm.indexCommentSelected);

    videoServiceData.comments.forEach(function (comment) {
      if (vm.flagVideoId === comment.id) {
        comment.comments[vm.indexCommentSelected].reports = comment.comments[vm.indexCommentSelected].reports + 1;
      }
    });

    vm.getComments(vm.flagVideoId);
  };

  vm.openDeleteComment = function (videoId, commentId) {
    vm.deleteVideoId = videoId;
    videoServiceData.comments.forEach(function (comment) {
      comment.comments.forEach(function (singleComment, index) {
        if (singleComment.id === commentId) {
          vm.deleteCommentSelected = singleComment;
          vm.indexCommentSelected = index;
          vm.openDeleteCommentPopup[comment.id] = true;
        }
      })
    });
  };

  vm.deleteComment = function () {

    videoServiceData.comments.forEach(function (comment) {
      if (vm.deleteVideoId === comment.id) {
        comment.comments.forEach(function (singleComment, index) {
          if (vm.deleteCommentSelected.id === singleComment.id) {
            comment.comments.splice(index, 1);
          }
        });
      }
    });
    vm.getComments();
  };

  vm.goToLocationVideo = function (video_id) {
    $routeParams.video_id = video_id;
    $location.path('/' + $routeParams.language + '/profile/location/' + $routeParams.video_id);
  }

}]);
