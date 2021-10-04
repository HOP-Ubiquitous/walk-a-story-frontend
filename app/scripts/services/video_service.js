'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.service('videoService', ['videoServiceApi', 'videoServiceData', 'userServiceData', 'locationServiceData', '$location', '$q', '$routeParams',
  function(videoServiceApi, videoServiceData, userServiceData, locationServiceData, $location, $q, $routeParams) {

  var service = this;

  service.videosLoaded = false;
  service.videosByPlaceLoaded = false;
  service.videoByIdLoaded = false;
  service.userVideosLoaded = false;
  service.reloadHome = false;
  service.markersReload = false;
  service.uploadingVideo = false;
  service.uploadError = false;
  service.selectCity = '';
  service.errorMessage = '';

  service.getVideoList = function () {

    var deferred = $q.defer();
    var promise = deferred.promise;

    videoServiceApi.get_video_list()
      .then(
        function success(response) {
          videoServiceData.videoList = response.data;
          service.videosLoaded = true;
          console.log('\x1b[32m%s\x1b[0m', 'Lista de vídeos cargada con éxito! :)');
          deferred.resolve("success");
        }
      )
      .catch(
        function () {
          console.log('\x1b[31m%s\x1b[0m', 'Error al cargar la lista de videos! :_(');
          deferred.resolve("fail");
        }
      );

    return promise;
  };

    service.getVideoListByPlace = function (city) {

      var deferred = $q.defer();
      var promise = deferred.promise;

      videoServiceApi.get_video_list()
        .then(
          function success(response) {
            videoServiceData.videoListByPlace = [];
            var currentCity = {};

            locationServiceData.citiesList.forEach(function (selectedCity) {
              if (city === selectedCity.id) {
                currentCity = selectedCity;
              }
            });

            response.data.videos.forEach(function (video) {
              currentCity.points_of_interest.forEach(function (poi) {
                if (video.place_id === poi.id) {
                  videoServiceData.videoListByPlace.push(video);
                }
              });
            });

            service.videosByPlaceLoaded = true;
            console.log('\x1b[32m%s\x1b[0m', 'Lista de vídeos cargada con éxito! :)');
            deferred.resolve("success");
          }
        )
        .catch(
          function () {
            console.log('\x1b[31m%s\x1b[0m', 'Error al cargar la lista de videos! :_(');
            deferred.resolve("fail");
          }
        );

      return promise;
    };

  service.getVideoListByPoiId = function (place_id) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    videoServiceApi.get_video_list_by_place(place_id)
      .then(
        function success(response) {
          videoServiceData.videoListByPoi = response.data;
          service.videosByPoiLoaded = true;
          console.log('\x1b[32m%s\x1b[0m', 'Lista de vídeos del lugar ' + place_id + ' cargada con éxito! :)');
        }
      )
      .catch(
        function () {
          console.log('\x1b[31m%s\x1b[0m', 'Error al cargar la lista de videos del lugar ' + place_id + '! :_(');
        }
      );

    return promise;
  };

  service.getVideoById = function (videoId) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    videoServiceApi.get_video_by_id(videoId)
      .then(
        function success(response) {
          videoServiceData.videoById = [];
          videoServiceData.videoById.push(response.data);
          console.log('\x1b[32m%s\x1b[0m', 'Vídeo con id ' + videoId + ' cargado con éxito! :)')
          service.videoByIdLoaded = true;

        }
      )
      .catch(
        function () {
          console.log('\x1b[31m%s\x1b[0m', 'Error al cargar el vídeo por ID! :_(')
        }
      );

    return promise;
  };

  service.getVideoListByUser = function (userId) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    videoServiceApi.get_video_list_by_user(userId)
      .then(
        function success(response) {
          videoServiceData.videoListByUser = response.data;
          service.userVideosLoaded = true;
          console.log(videoServiceData.videoListByUser);
          console.log('\x1b[32m%s\x1b[0m', 'Vídeos del usuario ' + userId + ' cargado con éxito! :)');
        }
      )
      .catch(
        function error() {
          console.log('\x1b[31m%s\x1b[0m', 'Error al cargar los videos del usuario ' + userId + '! :_(');
        }
      );

    return promise;
  };

  service.uploadVideo = function (video, place, register) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    videoServiceApi.upload_video(video, place)
      .then(
        function success(response) {
          console.log(response);
          register.videoId = response.data.id;
          videoServiceApi.upload_register(register);
          service.uploadingVideo = false;
          $location.path('/' + $routeParams.language + '/profile');
          console.log('\x1b[32m%s\x1b[0m', 'Vídeos subido con éxtito! :)');
        }
      )
      .catch(
        function error(error) {
          service.uploadingVideo = false;
          service.errorMessage = error.data;
          service.uploadError = true;
          console.log(error);
          console.log('\x1b[31m%s\x1b[0m', 'Error al surbir un vídeo! :_(');
        }
      );

    return promise;
  };

  service.deleteVideo = function (videoId) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    videoServiceApi.delete_video(videoId)
      .then(
        function success(response) {
          service.getVideoList();
          service.getVideoListByUser(userServiceData.users.id);
          console.log('\x1b[32m%s\x1b[0m', 'Video ' + videoId + ' borrado con éxito! :)');
        }
      )
      .catch(
        function () {
          console.log('\x1b[31m%s\x1b[0m', 'Error al borrar vídeo! :_(');
        }
      );

    return promise;
  };

  service.undeleteVideo = function (dataVideo, videoId) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    videoServiceApi.undelete_video(dataVideo, videoId)
      .then(
        function success(response) {
          service.getVideoList();
          service.getVideoListByUser(userServiceData.users.id);
          console.log('\x1b[32m%s\x1b[0m', 'Video ' + videoId + ' recuperado con éxito! :)');
        }
      )
      .catch(
        function () {
          console.log('\x1b[31m%s\x1b[0m', 'Error al recuperar vídeo! :_(');
        }
      );

    return promise;
  };

  service.publishVideo = function (dataVideo, videoId) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    videoServiceApi.video_to_public(dataVideo, videoId)
      .then(
        function success(response) {
          service.getVideoList();
          service.getVideoListByUser(userServiceData.users.id);
          console.log('\x1b[32m%s\x1b[0m', 'Video ' + videoId + ' publicado con éxito! :)');
        }
      )
      .catch(
        function () {
          console.log('\x1b[31m%s\x1b[0m', 'Error al publicar vídeo! :(');
        }
      );

    return promise;
  };

  service.privateVideo = function (dataVideo, videoId) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    videoServiceApi.video_to_private(dataVideo, videoId)
      .then(
        function success(response) {
          service.getVideoList();
          service.getVideoListByUser(userServiceData.users.id);
          console.log('\x1b[32m%s\x1b[0m', 'Video ' + videoId + ' puesto en privado! :)');
        }
      )
      .catch(
        function () {
          console.log('\x1b[31m%s\x1b[0m', 'Error al poner el vídeo en privado! :_(')
        }
      );

    return promise;
  };

  return service;

}]);
