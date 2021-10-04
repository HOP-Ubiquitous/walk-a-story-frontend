app.controller('filterMenuCtrl',
  ['rootService', 'videoService', 'videoServiceData', 'walkService', 'walkServiceData', 'locationServiceData', 'locationService', '$location', '$routeParams', 'localEcosystemService', 'localEcosystemServiceData',
    function (rootService, videoService, videoServiceData, walkService, walkServiceData, locationServiceData, locationService, $location, $routeParams, localEcosystemService, localEcosystemServiceData) {

      var vm = this;
      vm.showPoi = [];
      vm.rootService = rootService;
      vm.locationServiceData = locationServiceData;

      function getTypes() {
        vm.citiesList = [];

        localEcosystemServiceData.typeList.forEach(function (type) {

          var subtypes = [];
          type.subtypes.forEach(function (subtype) {

            var subtypeObject = {
              name: subtype.name,
              show: true
            };

            subtypes.push(subtypeObject);

          });

          var typeObject = {
            name: type.name,
            show: true,
            points_of_interest: subtypes
          };

          vm.citiesList.push(typeObject);

        });
      }
      getTypes();

      locationService.getCities();
      vm.getCitiesList = function() {

        if ($location.path().indexOf('/' + $routeParams.language + '/home') > -1) {
          vm.citiesList = locationServiceData.citiesList;
          if (videoServiceData.videoList.videos !== undefined) {
            videoServiceData.videoList.videos.forEach(function (video){
              vm.citiesList.forEach(function(city){

                if (city.show === undefined) {
                  angular.extend(city, {}, {show: false});
                }

                city.points_of_interest.forEach(function(poi) {

                  if (poi.show === undefined) {
                    angular.extend(poi, {}, {show: false});
                  }

                  if (poi.id === video.place_id) {
                    poi.show = true;
                    city.show = true;
                  }

                });
              });
            });
          }

        } else if ($location.path().indexOf('/' + $routeParams.language + '/walks') > -1) {
          vm.citiesList = locationServiceData.citiesList;
          if (walkServiceData.walkList !== undefined) {
            walkServiceData.walkList.forEach(function (walk){
              vm.citiesList.forEach(function(city){

                if (city.show === undefined) {
                  angular.extend(city, {}, {show: false});
                }

                city.points_of_interest.forEach(function(poi) {

                  if (poi.show === undefined) {
                    angular.extend(poi, {}, {show: false});
                  }

                  if (poi.id === walk.place_id) {
                    poi.show = true;
                    city.show = true;
                  }

                });
              });
            });
          }
        }

        console.log(vm.citiesList);

        return vm.citiesList;
      };

      vm.getCitiesList();

      vm.filterToggle = function () {
        rootService.openFilter = !rootService.openFilter;
        rootService.openMenu = false;
      };

      vm.goToCity = function (city) {

        $routeParams.place_id = city;
        var currentPath = '';

        if ($location.path().indexOf('/' + $routeParams.language + '/home') > -1) {

          currentPath = $location.absUrl();
          videoService.getVideoListByPlace(city);

          if(city === 'all') {

            if(currentPath.indexOf('/' + $routeParams.language + '/location') > -1) {
              $location.path('/' + $routeParams.language + '/home/location/');
              videoService.markersReload = true;
            } else {
              $location.path('/' + $routeParams.language + '/home');
              // vm.walksFiltered = videoServiceData.walkList;
            }

          } else {

            if(currentPath.indexOf('/'+ $routeParams.language +'/location') > -1) {
              $location.path( '/'+ $routeParams.language + '/home/location/' + $routeParams.place_id);
              walkService.markersReload = true;
            } else {
              $location.path( '/'+ $routeParams.language + '/home/' + $routeParams.place_id);
              // vm.walksFiltered = walkServiceData.walkListByPlace;
            }

          }

          rootService.openFilter = false;
          walkService.selectCity = city;

        } else if ($location.path().indexOf('/' + $routeParams.language + '/walks') > -1) {

          currentPath = $location.absUrl();
          walkService.getWalkByPlaceId(city);

          if(city === 'all') {

            if (currentPath.indexOf('/' + $routeParams.language + '/location') > -1) {
              $location.path('/' + $routeParams.language + '/walks/location/');
              walkService.markersReload = true;
            } else {
              $location.path('/' + $routeParams.language + '/walks');
              // vm.walksFiltered = walkServiceData.walkList;
            }

          } else {

            if (currentPath.indexOf('/'+ $routeParams.language +'/location') > -1) {
              $location.path( '/'+ $routeParams.language + '/walks/location/' + $routeParams.place_id);
              walkService.markersReload = true;
            } else {
              $location.path( '/'+ $routeParams.language + '/walks/' + $routeParams.place_id);
              // vm.walksFiltered = walkServiceData.walkListByPlace;
            }

          }

          rootService.openFilter = false;
          walkService.selectCity = city;

        } else {
          localEcosystemService.getLocalType(city);
          $routeParams.type_id = city;
          $location.path( '/'+ $routeParams.language + '/local_ecosystem/' + $routeParams.type_id);
          rootService.openFilter = false;
        }

      };

      vm.goToPOI = function (poi_id, city_id) {

        var currentPath = '';
        $routeParams.place_id = city_id;
        $routeParams.poi_id = poi_id;

        if ($location.path().indexOf('/' + $routeParams.language + '/home') > -1) {

          currentPath = $location.absUrl();
          videoService.getVideoListByPoiId(poi_id);

          if(poi_id === 'all') {

            if(currentPath.indexOf('/' + $routeParams.language + '/location') > -1) {
              $location.path('/' + $routeParams.language + '/home/location/');
              videoService.markersReload = true;
            } else {
              $location.path('/' + $routeParams.language + '/home');
              // vm.walksFiltered = walkServiceData.walkList;
            }

          } else {

            if(currentPath.indexOf('/'+ $routeParams.language +'/location') > -1) {
              $location.path( '/'+ $routeParams.language + '/home/location/' + $routeParams.place_id + '/' + $routeParams.poi_id);
              walkService.markersReload = true;
            } else {
              $location.path( '/'+ $routeParams.language + '/home/' + $routeParams.place_id + '/' + $routeParams.poi_id);
              // vm.walksFiltered = walkServiceData.walkListByPoi;
            }

          }

          rootService.openFilter = false;
          walkService.selectCity = poi_id;

        } else if ($location.path().indexOf('/' + $routeParams.language + '/walks') > -1) {

          currentPath = $location.absUrl();
          walkService.getWalkByPoiId(poi_id);

          if(poi_id === 'all') {

            if (currentPath.indexOf('/' + $routeParams.language + '/location') > -1) {
              $location.path('/' + $routeParams.language + '/walks/location/');
              walkService.markersReload = true;
            } else {
              $location.path('/' + $routeParams.language + '/walks');
              // vm.walksFiltered = walkServiceData.walkList;
            }

          } else {

            if (currentPath.indexOf('/'+ $routeParams.language +'/location') > -1) {
              $location.path( '/'+ $routeParams.language + '/walks/location/' + $routeParams.place_id + '/' + $routeParams.poi_id);
              walkService.markersReload = true;
            } else {
              $location.path( '/'+ $routeParams.language + '/walks/' + $routeParams.place_id + '/' + $routeParams.poi_id);
              // vm.walksFiltered = walkServiceData.walkListByPlace;
            }

          }

          rootService.openFilter = false;
          walkService.selectCity = poi_id;

        } else {
          localEcosystemService.getLocalSubtype(poi_id);
          $routeParams.type_id = city_id;
          $routeParams.subtype_id = poi_id;
          $location.path( '/'+ $routeParams.language + '/local_ecosystem/' + $routeParams.type_id + '/' + $routeParams.subtype_id);
          rootService.openFilter = false;
        }

      };

      vm.getPoiByIndex = function (index, showBoolean) {
        vm.pois = vm.citiesList[index].points_of_interest;

        vm.showPoi = [];
        vm.pois.forEach(function () {
          vm.showPoi.push(false);
        });

        if (showBoolean === true) {
          vm.showPoi[index] = false;
        } else {
          vm.showPoi[index] = true;
        }

        return vm.pois;
      };

      vm.goToAllLocals = function() {
        localEcosystemService.getLocals();
        $location.path('/' + $routeParams.language + '/local_ecosystem');
        rootService.openFilter = false;
      };

      vm.backToHome = function () {
        if ($location.path().indexOf('/' + $routeParams.language + '/home') > -1) {
          $location.path('/' + $routeParams.language + '/home');
        } else if ($location.path().indexOf('/' + $routeParams.language + '/walks') > -1) {
          $location.path('/' + $routeParams.language + '/walks');
        }  else if ($location.path().indexOf('/' + $routeParams.language + '/local_ecosystem') > -1) {
          $location.path('/' + $routeParams.language + '/local_ecosystem');
          localEcosystemService.markersReload = true;
        }
      };

    }
  ]
);
