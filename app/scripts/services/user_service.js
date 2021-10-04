'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.service('userService', ['userServiceApi', 'userServiceData', '$location', '$routeParams', '$cookies', '$timeout', '$q',
  function(userServiceApi, userServiceData, $location, $routeParams, $cookies, $timeout, $q) {

  var service = this;
 // var language = "es";

  service.login = function (user,language) {

    //service.language = language;
    var deferred = $q.defer();
    var promise = deferred.promise;

    userServiceApi.login(user)
      .then(
        function success(response) {

          var now = new window.Date(),
            exp = new window.Date(now.getFullYear(), now.getMonth()+1, now.getDate());

          userServiceData.users = response.data;

          $cookies.put('users', JSON.stringify(userServiceData.users), {
            expires: exp
          });

          $location.path( '/' + $routeParams.language + '/home');
          console.log('\x1b[32m%s\x1b[0m', 'Usuario ' + response.data.username + ' logeado! :)');
        }
      )
      .catch(
        function () {
          service.errorMessage = 'Wrong username or password!';
          service.openMessageWindow = true;

          $timeout(function quitPopup() {
            service.openMessageWindow = false;
          });
          service.errorMessage = 'Wrong username or password!';
          console.log('\x1b[31m%s\x1b[0m', 'Error al hacer login! :_(');
        }
      );

    return promise;

  };

  service.createUser = function (user) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    userServiceApi.create_user(user)
      .then(
        function success(response) {
          var newUser = {
            username: user.username,
            password: user.password
          };

          service.login(newUser);
          console.log('\x1b[32m%s\x1b[0m', 'Usuario creado con éxito! :)');
        }
      )
      .catch(
        function () {
          service.errorMessage = 'You must fill all the required fields!';
          service.openMessageWindow = true;

          $timeout(function quitPopup() {
            service.openMessageWindow = false;
          });
          console.log('\x1b[31m%s\x1b[0m', 'Error al hacer login! :_(')
        }
      );

    return promise;

  };

  service.updateRole = function (user) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    userServiceApi.update_role(user)
      .then(
        function success(response) {
          console.log('\x1b[32m%s\x1b[0m', 'Rol de usuario actualizado con éxito! :)');
        }
      )
      .catch(
        function () {
          console.log('\x1b[31m%s\x1b[0m', 'Error al actualizar el rol de usuario! :_(')
        }
      );

    return promise;

  };

  service.logout = function () {

    var deferred = $q.defer();
    var promise = deferred.promise;

    userServiceApi.logout()
      .then(
        function success(response) {
          userServiceData.users = [];
          $cookies.remove('users', JSON.stringify(userServiceData.users));
          $location.path('/' + $routeParams.language + '/login');
          console.log('\x1b[32m%s\x1b[0m', 'Éxito al hacer Logout! :)');
        }
      )
      .catch(
        function error() {
          console.log('\x1b[31m%s\x1b[0m', 'Error al hacer logout! :_(');
        }
      );

    return promise;

  };

  service.getUserList = function () {

    var deferred = $q.defer();
    var promise = deferred.promise;

    userServiceApi.get_user_list()
      .then(
        function success(response) {
          userServiceData.userList = response.data;
          console.log('\x1b[32m%s\x1b[0m', 'Lista de usuarios cargada con éxito! :)');
        }
      )
      .catch(
        function error() {
          console.log('\x1b[31m%s\x1b[0m', 'Error al cargar la lista de usuarios! :_(');
        }
      );

    return promise;

  };

  service.deleteUserByUser = function (user) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    userServiceApi.delete_user_by_user(user)
      .then(
        function success(response) {
          console.log('\x1b[32m%s\x1b[0m', 'Usuario borrado con éxito! :)');
        }
      )
      .catch(
        function error() {
          console.log('\x1b[31m%s\x1b[0m', 'Error al borrar el usuario! :_(');
        }
      );

    return promise;

  };

  service.deleteUserByAdmin = function (user) {

    var deferred = $q.defer();
    var promise = deferred.promise;

    userServiceApi.delete_user_by_admin(user)
      .then(
        function success(response) {
          service.getUserList();
          console.log('\x1b[32m%s\x1b[0m', 'Usuario borrado con éxito! :)');
        }
      )
      .catch(
        function error() {
          console.log('\x1b[31m%s\x1b[0m', 'Error al borrar el usuario! :_(');
        }
      );

    return promise;

  };

  return service;

}]);
