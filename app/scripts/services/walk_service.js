'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.service('walkService', ['walkServiceApi', 'walkServiceData', 'userServiceData', 'locationServiceData', '$location', '$q', '$timeout', '$routeParams',
  function(walkServiceApi, walkServiceData, userServiceData, locationServiceData, $location, $q, $timeout, $routeParams) {

  var service = this;

  service.openMenu = false;
  service.openFilter = false;
  service.openMessageWindow = false;
  service.walkListLoaded = false;
  service.walkListByPlaceLoaded = false;
  service.walkByIdLoaded = false;
  service.participantsLoaded = false;
  service.placeParticipantsLoaded = false;
  service.poiParticipantsLoaded = false;
  service.singleParticipantsLoaded = false;
  service.reloadWalks = false;
  service.markersReload = false;
  service.selectCity = '';
  service.uploadingWalk = false;

  service.addWalk = function (walk) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    walkServiceApi.add_walk(walk)
      .then(
        function success(response) {
          console.log(response.data);
          console.log('\x1b[32m%s\x1b[0m', 'Caminata creada con éxito! :)');
          service.getWalks();
          service.uploadingWalk = false;
          $location.path('/' + $routeParams.language + '/walks');
        }
      )
      .catch(
        function error() {
          console.log('\x1b[31m%s\x1b[0m', 'Error al crear una caminata! :_(');
        }
      );

    return promise;
  };

  service.addWalkImage = function (image, walk) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    walkServiceApi.add_walk_image(image)
      .then(
        function success(response) {
          console.log(response.data);
          walk.image = response.data.url;
          service.addWalk(walk);
          console.log('\x1b[32m%s\x1b[0m', 'Imagen de la caminata subida con éxito! :)');
        }
      )
      .catch(
        function error() {
          console.log('\x1b[31m%s\x1b[0m', 'Error al subir la imagen de la caminata! :_(');
        }
      );

    return promise;
  };

  service.updateWalk = function (walk, walk_id) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    walkServiceApi.update_walk(walk, walk_id)
      .then(
        function success(response) {
          console.log(response);
          console.log('\x1b[32m%s\x1b[0m', 'Caminata actualizada con éxito! :)');
          service.getWalks();
          $location.path('/' + $routeParams.language + '/walks');
        }
      )
      .catch(
        function error() {
          console.log('\x1b[31m%s\x1b[0m', 'Error al actualizar una caminata! :_(');
        }
      );

    return promise;
  };

  service.deleteWalk = function (walk_id) {
    var deferred = $q.defer();
    var promise = deferred.promise;

    walkServiceApi.delete_walk(walk_id)
      .then(
        function success(response) {
          console.log('\x1b[32m%s\x1b[0m', 'Caminata con ' + walk_id + " borrada con éxito! :)");
          service.getWalks();
        }
      )
      .catch(
        function () {
          console.log('\x1b[31m%s\x1b[0m', 'Error al borrar la caminata! :_(');
        }
      );

    return promise;

  };

  service.getWalks = function () {

    var deferred = $q.defer();
    var promise = deferred.promise;

    walkServiceApi.get_walks()
      .then(
        function success(response) {
          walkServiceData.walkList = response.data;
          service.walkListLoaded = true;
          console.log('\x1b[32m%s\x1b[0m', 'Caminatas recibidas con éxito! :)');
        }
      )
      .catch(
        function error() {
          console.log('\x1b[31m%s\x1b[0m', 'Error al recibir las caminata! :_(');
        }
      );

    return promise;
  };

    service.getWalkByPlaceId = function (city) {

      var deferred = $q.defer();
      var promise = deferred.promise;

      walkServiceApi.get_walks()
        .then(
          function success(response) {

            walkServiceData.walkListByPlace = [];
            var currentCity = {};

            locationServiceData.citiesList.forEach(function (selectedCity) {
              if (city === selectedCity.id) {
                currentCity = selectedCity;
              }
            });

            response.data.forEach(function (walk) {
              currentCity.points_of_interest.forEach(function (poi) {
                if (walk.place_id === poi.id) {
                  walkServiceData.walkListByPlace.push(walk);
                }
              });
            });

            service.walkListByPlaceLoaded = true;
            console.log('\x1b[32m%s\x1b[0m', 'Caminatas recibidas con éxito! :)');
          }
        )
        .catch(
          function error() {
            console.log('\x1b[31m%s\x1b[0m', 'Error al recibir las caminata! :_(');
          }
        );

      return promise;
    };

  service.getWalkById = function (walk_id) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    walkServiceApi.get_walk_by_id(walk_id)
      .then(
        function success(response) {
          walkServiceData.walkListById = response.data;
          service.walkByIdLoaded = true;
          console.log(response);
          console.log('\x1b[32m%s\x1b[0m', 'Caminatas con id ' + walk_id + ' recibida con éxito! :)');
        }
      )
      .catch(
        function error() {
          console.log('\x1b[31m%s\x1b[0m', 'Error al recibir la caminata con id ' + walk_id + '! :_(');
        }
      );

    return promise;
  };

  service.getWalkByIdParticipants = function (walk_id) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    walkServiceApi.get_walk_by_id_participants(walk_id)
      .then(
        function success(response) {
          walkServiceData.walkListByIdParticipants = response.data.participants;
          service.participantsLoaded = true;
          service.placeParticipantsLoaded = true;
          service.poiParticipantsLoaded = true;
          service.singleParticipantsLoaded = true;
          console.log(walkServiceData.walkListByIdParticipants);
          console.log('\x1b[32m%s\x1b[0m', 'Participantes de la caminatas con id ' + walk_id + ' recibidos con éxito! :)');
        }
      )
      .catch(
        function error() {
          console.log('\x1b[31m%s\x1b[0m', 'Error al recibir los participantes de la caminata con id ' + walk_id + '! :_(');
        }
      );

    return promise;
  };

  service.getWalkByPoiId = function (place_id) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    walkServiceApi.get_walk_by_place_id(place_id)
      .then(
        function success(response) {
          walkServiceData.walkListByPoi = response.data;
          service.walkListByPoiLoaded = true;
          console.log(response);
          console.log('\x1b[32m%s\x1b[0m', 'Caminatas del point ' + place_id + ' recibidas con éxito! :)');
        }
      )
      .catch(
        function error() {
          console.log('\x1b[31m%s\x1b[0m', 'Error al recibir las caminatas del punto ' + place_id + '! :_(');
        }
      );

    return promise;
  };

  service.getWalkByParticipantUser = function (user_id) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    walkServiceApi.get_walk_by_participant_user(user_id)
      .then(
        function success(response) {
          walkServiceData.walkListByParticipantUser = response.data;
          console.log(response);
          console.log('\x1b[32m%s\x1b[0m', 'Caminatas del participante ' + user_id + ' recibidas con éxito! :)');
        }
      )
      .catch(
        function error() {
          console.log('\x1b[31m%s\x1b[0m', 'Error al recibir las caminatas del participante ' + user_id + '! :_(');
        }
      );

    return promise;
  };

  service.getWalkByRegisteredUser = function (user_id) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    walkServiceApi.get_walk_by_registered_user(user_id)
      .then(
        function success(response) {
          walkServiceData.walkListByRegisteredUser = response.data;
          console.log(response);
          console.log('\x1b[32m%s\x1b[0m', 'Caminatas del usuario ' + user_id + ' recibidas con éxito! :)');
        }
      )
      .catch(
        function error() {
          console.log('\x1b[31m%s\x1b[0m', 'Error al recibir las caminatas del usuario ' + user_id + '! :_(');
        }
      );

    return promise;
  };

  service.putParticipantToWalk = function(user, walk_id) {
    var deferred = $q.defer();
    var promise = deferred.promise;

    walkServiceApi.put_participant_to_walk(user, walk_id)
      .then(
        function success(response) {
          //TODO Watcher no funciona
          service.walkListLoaded = true;
          service.walkListByPlaceLoaded = true;
          service.walkListByPoiLoaded = true;
          service.walkByIdLoaded = true;
          console.log('\x1b[32m%s\x1b[0m', 'Usuario ' + user.user_id + ' se ha suscrito a la caminata ' + walk_id + '! :)');
        }
      )
      .catch(
        function () {
          console.log('\x1b[31m%s\x1b[0m', 'Error al suscribirse a una caminata! :_(');
        }
      );

    return promise;

  };

  service.deleteParticipantFromWalk = function(user, walk_id) {
    var deferred = $q.defer();
    var promise = deferred.promise;

    walkServiceApi.delete_participant_from_walk(user, walk_id)
      .then(
        function success(response) {
          console.log('\x1b[32m%s\x1b[0m', 'Usuario ' + user.name + ' se ha borrado de la caminata ' + walk_id + '! :)')
        }
      )
      .catch(
        function () {
          console.log('\x1b[31m%s\x1b[0m', 'Error al suscribirse a una caminata! :_(')
        }
      );

    return promise;

  };

  return service;

}]);
