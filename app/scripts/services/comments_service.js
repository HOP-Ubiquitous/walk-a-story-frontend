'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.service('commentsService', ['commentsServiceApi', 'commentsServiceData', '$location', '$cookies', '$timeout', '$q',
  function(commentsServiceApi, commentsServiceData, $location, $cookies, $timeout, $q) {

  var service = this;

  service.commentsLoaded = false;

  service.addComment = function (comment) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    commentsServiceApi.add_comment(comment)
      .then(
        function success(response) {
          service.getComments()
          console.log('\x1b[32m%s\x1b[0m', 'Comentario añadido con éxito! :)');
        }
      )
      .catch(
        function () {
          console.log('\x1b[31m%s\x1b[0m', 'Error al crear un comentario! :_(');
        }
      );

    return promise;

  };

  service.getComments = function () {

    var deferred = $q.defer();
    var promise = deferred.promise;

    commentsServiceApi.get_comments()
      .then(
        function success(response) {
          commentsServiceData.commentsList = response.data;
          service.commentsLoaded = true;
          console.log('\x1b[32m%s\x1b[0m', 'Cargados todos los comentarios! :)');
        }
      )
      .catch(
        function () {
          console.log('\x1b[31m%s\x1b[0m', 'Error al cargar todos los comentarios! :_(')
        }
      );

    return promise;

  };

  service.getCommentsByVideoId = function (video_id) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    commentsServiceApi.get_comments_by_video_id(video_id)
      .then(
        function success(response) {
          commentsServiceData.commentsListByVideo = response.data;
          console.log('\x1b[32m%s\x1b[0m', 'Cargados los comentarios del video ' + video_id + '! :)')
        }
      )
      .catch(
        function error() {
          console.log('\x1b[31m%s\x1b[0m', 'Error al cargar los comentarios del vídeo ' + video_id + '! :_(');
        }
      );

    return promise;

  };

  service.putCommentEnabled = function (comment_id) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    commentsServiceApi.put_comment_enabled(comment_id)
      .then(
        function success(response) {
          console.log('\x1b[32m%s\x1b[0m', 'Comentario ' + comment_id + ' habilitado! :)');
        }
      )
      .catch(
        function error() {
          console.log('\x1b[31m%s\x1b[0m', 'Error al habilitar el comentario ' + comment_id + '! :_(');
        }
      );

    return promise;

  };

  service.putCommentDisabled = function (comment_id) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    commentsServiceApi.put_comment_disabled(comment_id)
      .then(
        function success(response) {
          console.log('\x1b[32m%s\x1b[0m', 'Comentario ' + comment_id + ' deshabilitado! :)');
        }
      )
      .catch(
        function error() {
          console.log('\x1b[31m%s\x1b[0m', 'Error al deshabilitar el comentario ' + comment_id + '! :_(');
        }
      );

    return promise;

  };

  service.deleteComment = function (comment_id) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    commentsServiceApi.delete_comment(comment_id)
      .then(
        function success(response) {
          console.log('\x1b[32m%s\x1b[0m', 'Comentario ' + comment_id + ' borrado con éxtio! :)')
        }
      )
      .catch(
        function error() {
          console.log('\x1b[31m%s\x1b[0m', 'Error al borrar el comentario ' + comment_id + '! :_(');
        }
      );

    return promise;

  };

  return service;

}]);
