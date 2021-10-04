'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.service('ratingService', ['ratingServiceApi', 'videoService', 'ratingServiceData', '$location', '$cookies', '$timeout', '$q',
  function(ratingServiceApi, ratingServiceData, videoService, $location, $cookies, $timeout, $q) {

  var service = this;

  service.ratingUpdated = false;
  service.commentRatingUpdated = false;
  service.commentReportUpdated = false;

  service.addRatingVoteToComment = function (rating) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    ratingServiceApi.add_rating_vote_to_comment(rating)
      .then(
        function success(response) {
          service.commentRatingUpdated = true;
          console.log('\x1b[32m%s\x1b[0m', 'Añadido voto a comentario! :)');
        }
      )
      .catch(
        function () {
          console.log('\x1b[31m%s\x1b[0m', 'Error al añadir voto a comentario! :_(');
        }
      );

    return promise;

  };

  service.addRatingReportToComment = function (report) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    ratingServiceApi.add_rating_report_to_comment(report)
      .then(
        function success(response) {
          service.commentReportUpdated = true;
          console.log('\x1b[32m%s\x1b[0m', 'Añadido report a comentario! :)');
        }
      )
      .catch(
        function () {
          console.log('\x1b[31m%s\x1b[0m', 'Error al añadir report a comentario! :_(')
        }
      );

    return promise;

  };

  service.addRatingVoteToVideo = function (rating) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    ratingServiceApi.add_rating_vote_to_video(rating)
      .then(
        function success(response) {
          service.ratingUpdated = true;
          console.log('\x1b[32m%s\x1b[0m', 'Añadido voto a vídeo! :)')
        }
      )
      .catch(
        function error() {
          console.log('\x1b[31m%s\x1b[0m', 'Error al añadir voto a vídeo! :_(');
        }
      );

    return promise;

  };

  service.addRatingReportToVideo = function (report) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    ratingServiceApi.add_rating_report_to_video(report)
      .then(
        function success(response) {
          console.log('\x1b[32m%s\x1b[0m', 'Añadido report a vídeo! :)');
        }
      )
      .catch(
        function error() {
          console.log('\x1b[31m%s\x1b[0m', 'Error al añadir report a vídeo! :_(');
        }
      );

    return promise;

  };

  service.getRatingCommentsByUserIdAndVideoId = function (user_id, video_id) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    ratingServiceApi.get_rating_comments_by_user_id_and_video_id(user_id, video_id)
      .then(
        function success(response) {
          console.log('\x1b[32m%s\x1b[0m', 'Rating de comentarios recibidos con éxito! :)');
        }
      )
      .catch(
        function error() {
          console.log('\x1b[31m%s\x1b[0m', 'Error al recibir el rating de los comentarios! :_(');
        }
      );

    return promise;

  };

  service.getReportsCommentsByUserIdAndVideoId = function (user_id, video_id) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    ratingServiceApi.get_reports_comments_by_user_id_and_video_id(user_id, video_id)
      .then(
        function success(response) {
          console.log('\x1b[32m%s\x1b[0m', 'Reports de comentarios recibidos con éxtio! :)');
        }
      )
      .catch(
        function error() {
          console.log('\x1b[31m%s\x1b[0m', 'Error al recibir los reports de los comentarios! :_(');
        }
      );

    return promise;

  };

  service.getRatingVideoByUserIdAndVideoId = function (user_id, video_id) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    ratingServiceApi.get_rating_video_by_user_id_and_video_id(user_id, video_id)
      .then(
        function success(response) {
          console.log('\x1b[32m%s\x1b[0m', 'Rating de vídeo recibido con éxito! :)');
        }
      )
      .catch(
        function error() {
          console.log('\x1b[31m%s\x1b[0m', 'Error al recibir el rating de vídeo! :_(');
        }
      );

    return promise;

  };

  service.getReportsVideoByUserIdAndVideoId = function (user_id, video_id) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    ratingServiceApi.get_reports_video_by_user_id_and_video_id(user_id, video_id)
      .then(
        function success(response) {
          console.log('\x1b[32m%s\x1b[0m', 'Reports de vídeo recibido con éxtio! :)')
        }
      )
      .catch(
        function error() {
          console.log('\x1b[31m%s\x1b[0m', 'Error al recibir los reports del vídeo! :_(');
        }
      );

    return promise;

  };

  // DISABLED!!
  service.deleteRating = function (rating_id) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    ratingServiceApi.delete_rating(rating_id)
      .then(
        function success(response) {
          console.log('\x1b[32m%s\x1b[0m', 'Rating borrado con éxito! :)');
        }
      )
      .catch(
        function error() {
          console.log('\x1b[31m%s\x1b[0m', 'Error al borrar el rating! :_(')
        }
      );

    return promise;

  };

  return service;

}]);
