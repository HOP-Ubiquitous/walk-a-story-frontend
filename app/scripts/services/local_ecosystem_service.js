'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.service('localEcosystemService', ['localEcosystemServiceApi', 'localEcosystemServiceData', 'userServiceData', 'locationServiceData', '$location', '$q', '$timeout', '$routeParams',
  function(localEcosystemServiceApi, localEcosystemServiceData, userServiceData, locationServiceData, $location, $q, $timeout, $routeParams) {

    var service = this;

    service.openMenu = false;
    service.openFilter = false;
    service.openMessageWindow = false;
    service.localListLoaded = false;
    service.localsByTypeLoaded = false;
    service.localsByIdLoaded = false;
    service.localsByOwnerIdLoaded = false;
    service.reloadWalks = false;
    service.markersReload = false;
    service.uploadingLocal = false;
    service.selectCity = '';

    service.addLocal = function (local, video, place, register) {

      var deferred = $q.defer();
      var promise = deferred.promise;

      localEcosystemServiceApi.add_local(local)
        .then(
          function success(response) {
            console.log(response.data);
            console.log('\x1b[32m%s\x1b[0m', 'Local creado con éxito! :)');
            service.localId = response.data.id;
            service.uploadVideo(local, video, place, register);
            // service.getLocals();
            // $location.path('/' + $routeParams.language + '/local_ecosystem');
          }
        )
        .catch(
          function error() {
            console.log('\x1b[31m%s\x1b[0m', 'Error al crear un local! :_(');
          }
        );

      return promise;
    };

    service.addLocalImage = function (imageArray, local, video, place, register) {

      var deferred = $q.defer();
      var promise = deferred.promise;

      imageArray.forEach(function (image, index) {
        localEcosystemServiceApi.add_local_image(image).then(function success(response) {
          console.log(response.data);
          local.workers[index].photo = response.data.url;

          if (index >= local.workers.length - 1) {
            console.log(local);
            var localJSON = JSON.stringify(local);
            service.addLocal(localJSON, video, place, register);
          }

          console.log('\x1b[32m%s\x1b[0m', 'Imagen del trabajador subida con éxito! :)');
        }).catch(function error() {
          console.log('\x1b[31m%s\x1b[0m', 'Error al subir la imagen del trabajador! :_(');
        });
      });

      return promise;
    };

    service.editLocalImage = function (imageArray, local, local_id, register) {

      var deferred = $q.defer();
      var promise = deferred.promise;

      imageArray.forEach(function (image, index) {
        localEcosystemServiceApi.add_local_image(image).then(function success(response) {
          console.log(response.data);
          local.workers[index].photo = response.data.url;

          if (index >= local.workers.length - 1) {
            console.log(local);
            var localJSON = JSON.stringify(local);
            service.updateLocal(localJSON, local_id, register);
          }

          console.log('\x1b[32m%s\x1b[0m', 'Imagen del trabajador subida con éxito! :)');
        }).catch(function error() {
          console.log('\x1b[31m%s\x1b[0m', 'Error al subir la imagen del trabajador! :_(');
        });
      });

      return promise;
    };

    service.uploadVideo = function (local, video, place, register) {

      var deferred = $q.defer();
      var promise = deferred.promise;

      localEcosystemServiceApi.upload_video(video, place)
        .then(
          function success(response) {
            console.log(response);
            register.videoId = response.data.id;
            service.registerVideo(register, local);
            console.log('\x1b[32m%s\x1b[0m', 'Vídeos subido con éxtito! :)');
          }
        )
        .catch(
          function error() {
            console.log('\x1b[31m%s\x1b[0m', 'Error al surbir un vídeo! :_(');
          }
        );

      return promise;
    };

    service.registerVideo = function (register, local, origin) {

      var deferred = $q.defer();
      var promise = deferred.promise;

      localEcosystemServiceApi.upload_register(register)
        .then(
          function success(response) {
            console.log(response);
            register.videoId = response.data.id;
            var localParse = JSON.parse(local);
            localParse.mainVideoId = response.data.id;
            var localString = JSON.stringify(localParse);
            console.log('\x1b[32m%s\x1b[0m', 'Vídeos registrado con éxtito! :)');

            if (origin === 'edit') {
              service.getLocals(origin);
            } else {
              service.updateLocal(localString, service.localId);
            }
          }
        )
        .catch(
          function error() {
            console.log('\x1b[31m%s\x1b[0m', 'Error al registrar un vídeo! :_(');
          }
        );

      return promise;
    };

    service.uploadVideoAnswer = function (video, place, register) {

      var deferred = $q.defer();
      var promise = deferred.promise;

      localEcosystemServiceApi.upload_video(video, place)
        .then(
          function success(response) {
            console.log(response);
            register.videoId = response.data.id;
            localEcosystemServiceApi.upload_register(register);
            $location.path('/' + $routeParams.language + '/local_ecosystem/' + $routeParams.type_id + '/' + $routeParams.subtype_id + '/' + $routeParams.local_id);
            console.log('\x1b[32m%s\x1b[0m', 'Vídeos subido con éxtito! :)');
          }
        )
        .catch(
          function error() {
            console.log('\x1b[31m%s\x1b[0m', 'Error al surbir un vídeo! :_(');
          }
        );

      return promise;
    };



    service.updateLocal = function (local, local_id, register) {

      var deferred = $q.defer();
      var promise = deferred.promise;

      localEcosystemServiceApi.update_local(local, local_id)
        .then(
          function success(response) {
            console.log(response);
            console.log('\x1b[32m%s\x1b[0m', 'Local actualizado con éxito! :)');

            service.uploadingLocal = false;
            if ($location.path().indexOf('/' + $routeParams.language + '/local_ecosystem/' + $routeParams.type_id + '/' + $routeParams.subtype_id + '/' + $routeParams.local_id + '/edit_local') > -1) {
              service.registerVideo(register, local, 'edit');
              $location.path('/' + $routeParams.language + '/local_ecosystem/' + response.data.type + '/' + response.data.subtype + '/' + response.data.id);
            } else {
              $location.path('/' + $routeParams.language + '/local_ecosystem/' + response.data.type + '/' + response.data.subtype + '/' + response.data.id);
            }

          }
        )
        .catch(
          function error() {
            console.log('\x1b[31m%s\x1b[0m', 'Error al actualizar un local! :_(');
          }
        );

      return promise;
    };

    service.deleteLocal = function (local_id) {
      var deferred = $q.defer();
      var promise = deferred.promise;

      localEcosystemServiceApi.delete_local(local_id)
        .then(
          function success(response) {
            console.log('\x1b[32m%s\x1b[0m', 'Local con id ' + local_id + " borrado con éxito! :)");
            service.getLocals();
          }
        )
        .catch(
          function () {
            console.log('\x1b[31m%s\x1b[0m', 'Error al borrar el local! :_(');
          }
        );

      return promise;

    };

    service.getLocals = function (origin) {

      var deferred = $q.defer();
      var promise = deferred.promise;

      localEcosystemServiceApi.get_locals().then(function success(response) {
          localEcosystemServiceData.localList = response.data;
          service.localListLoaded = true;
          service.markersReload = true;
          if (origin === 'edit') {
            service.getLocalById($routeParams.local_id);
            $location.path('/' + $routeParams.language + '/local_ecosystem/' + $routeParams.type_id + '/' + $routeParams.subtype_id + '/' + $routeParams.local_id);
          }
          console.log('\x1b[32m%s\x1b[0m', 'Locales recibidos con éxito! :)');
        }
      )
        .catch(function error() {
            console.log('\x1b[31m%s\x1b[0m', 'Error al recibir los locales! :_(');
          }
        );

      return promise;
    };

    service.getLocalById = function (local_id) {

      var deferred = $q.defer();
      var promise = deferred.promise;

      localEcosystemServiceApi.get_locals_by_id(local_id).then(function success(response) {

          service.localsByIdLoaded = true;
          localEcosystemServiceData.localById = response.data;
          console.log('\x1b[32m%s\x1b[0m', 'Local con id ' + local_id + ' recibido con éxito! :)');
        }
      )
        .catch(
          function error() {
            console.log('\x1b[31m%s\x1b[0m', 'Error al recibir local con id ' + local_id + '! :_(');
          }
        );

      return promise;
    };

    service.getLocalType = function (type) {

      var deferred = $q.defer();
      var promise = deferred.promise;

      localEcosystemServiceApi.get_locals_by_type(type).then(function success(response) {
          // localEcosystemServiceData.localsByType = response.data;
          localEcosystemServiceData.localList = response.data;
          service.localsByTypeLoaded = true;
          service.markersReload = true;
          console.log(response);
          console.log('\x1b[32m%s\x1b[0m', 'Locales de tipo ' + type + ' recibidos con éxito! :)');
        }
      )
        .catch(
          function error() {
            console.log('\x1b[31m%s\x1b[0m', 'Error al recibir los locales de tipo ' + type + '! :_(');
          }
        );

      return promise;
    };

    service.getLocalSubtype = function (subtype) {

      var deferred = $q.defer();
      var promise = deferred.promise;

      localEcosystemServiceApi.get_locals_by_subtype(subtype).then(function success(response) {
          // localEcosystemServiceData.localsByType = response.data;
          localEcosystemServiceData.localList = response.data;
          service.localsByTypeLoaded = true;
          service.markersReload = true;
          console.log(response);
          console.log('\x1b[32m%s\x1b[0m', 'Locales de subtipo ' + subtype + ' recibidos con éxito! :)');
        }
      )
        .catch(
          function error() {
            console.log('\x1b[31m%s\x1b[0m', 'Error al recibir los locales de subtipo ' + subtype + '! :_(');
          }
        );

      return promise;
    };

    service.getLocalsByOwnerId = function (user_id) {

      var deferred = $q.defer();
      var promise = deferred.promise;

      localEcosystemServiceApi.get_locals_by_owner_id(user_id).then(function success(response) {
          localEcosystemServiceData.localsByOwnerId = response.data;
          service.localsByOwnerIdLoaded = true;
          console.log(localEcosystemServiceData.localsByOwnerId);
          console.log('\x1b[32m%s\x1b[0m', 'Locales publicados por el usuario ' + user_id + ' recibidos con éxito! :)');
        }
      )
        .catch(
          function error() {
            console.log('\x1b[31m%s\x1b[0m', 'Error al recibir los locales del usuario con id ' + user_id + '! :_(');
          }
        );

      return promise;
    };

    service.setLocalActive = function (local_id) {

      var deferred = $q.defer();
      var promise = deferred.promise;

      localEcosystemServiceApi.set_local_active(local_id).then(function success(response) {
          service.getLocalById(local_id);
          console.log('\x1b[32m%s\x1b[0m', 'Local con id ' + local_id + ' activado con éxito! :)');
        }
      )
        .catch(
          function error() {
            console.log('\x1b[31m%s\x1b[0m', 'Error al activar el local con id ' + local_id + '! :_(');
          }
        );

      return promise;
    };

    service.setLocalInactive = function (local_id) {

      var deferred = $q.defer();
      var promise = deferred.promise;

      localEcosystemServiceApi.set_local_inactive(local_id).then(function success(response) {
          service.getLocalById(local_id);
          console.log('\x1b[32m%s\x1b[0m', 'Local con id ' + local_id + ' desactivado con éxito! :)');
        }
      )
        .catch(
          function error() {
            console.log('\x1b[31m%s\x1b[0m', 'Error al desactivar el local con id ' + local_id + '! :_(');
          }
        );

      return promise;
    };

    return service;

  }]);
