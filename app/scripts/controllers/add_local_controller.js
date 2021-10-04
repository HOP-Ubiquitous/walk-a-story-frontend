'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.controller('addLocalCtrl', [ 'rootService', '$scope', '$routeParams', '$timeout', 'userServiceData', 'locationService', 'localEcosystemService', 'localEcosystemServiceData', 'leafletMarkerEvents', 'videoService',
  function (rootService, $scope, $routeParams, $timeout, userServiceData, locationService, localEcosystemService, localEcosystemServiceData, leafletMarkerEvents, videoService) {

    var vm = this;

    vm.local = {};
    vm.local.description = 'Description';
    vm.local.workers = [{
      photo: '',
      name: '',
      job: ''
    }
    ];
    vm.locationService = locationService;
    vm.rootService = rootService;
    vm.typeList = localEcosystemServiceData.typeList;

    vm.local.type = vm.typeList[0];
    vm.subTypeList = vm.typeList[0].subtypes;
    vm.local.subType = vm.typeList[0].subtypes[0];

    var video = document.getElementById("preview");
    var input = document.querySelector('input[type=file]');

    vm.inputImage = true;
    vm.newVideo = {};

    vm.getUser = function () {
      return userServiceData.users;
    };

    function getMapData(lat, lng, zoom) {

      if (lat === undefined && lng === undefined) {
        if ($routeParams.language === 'es') {
          lat = 40.416864;
          lng = -3.703417;
        } else if ($routeParams.language === 'en') {
          lat = 51.508229;
          lng = -0.128258;
        } else if ($routeParams.language === 'fr') {
          lat = 48.861455;
          lng = 2.334136;
        } else if ($routeParams.language === 'cr') {
          lat = 45.800501;
          lng = 15.979015;
        } else if ($routeParams.language === 'dn') {
          lat = 55.675467;
          lng = 12.571028;
        } else if ($routeParams.language === 'tk') {
          lat = 39.933357;
          lng = 32.859438;
        } else if ($routeParams.language === 'pl') {
          lat = 52.2431473;
          lng = 21.0123283;
        } else {
          lat = 40.416864;
          lng = -3.703417;
        }
        zoom = 8;
      }

      vm.markers = {};
      vm.markers[0] = {
        lat: Number(lat),
        lng: Number(lng),
        focus: false,
        data: '',
        icon: {
          iconUrl: '../../images/event_icon.svg',
          iconSize: [30, 50],
          iconAnchor: [15, 50]
        }
      };

      angular.extend($scope, {
        defaults: {
          tileLayer: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
          maxZoom: 17
        },
        center: {
          lat: lat,
          lng: lng,
          zoom: zoom
        },
        markers: angular.copy(vm.markers),
        events: {
          markers: {
            enable: leafletMarkerEvents.getAvailableEvents()
          },
          map: {
            enable: ['click'],
            logic: 'emit'
          }
        }
      });

      vm.latitude = lat;
      vm.longitude = lng;

    }
    getMapData();

    $scope.$on('leafletDirectiveMap.places.click', function(event, args){
      vm.latitude = args.leafletEvent.latlng.lat;
      vm.longitude = args.leafletEvent.latlng.lng;
      getMapData(args.leafletEvent.latlng.lat, args.leafletEvent.latlng.lng, args.leafletObject._zoom);
    });

    vm.updateLocalTypes = function () {
      vm.subTypeList = vm.local.type.subtypes;
    };

    vm.addWorker = function () {
      var newWorker = {
        photo: '',
        name: '',
        job: ''
      };

      vm.local.workers.push(newWorker);
    };

    vm.deleteWorker = function (index) {
      vm.local.workers.splice(index, 1);
    };

    $scope.getVideoFromInput = function () {
      if (input.files && input.files[0]) {
        vm.inputImage = false;
        vm.file = input.files[0];
        vm.video = URL.createObjectURL(vm.file);
        var reader = new FileReader();
        reader.onload = function() {
          video.src = vm.video;
        };
        reader.readAsDataURL(vm.file);
      }
    };

    vm.showWorkerPreview = false;
    $scope.previewWorkerImage = function (event) {
      var output = document.getElementById('workerPreview');
      output.src = URL.createObjectURL(event.files[0]);
      vm.showWorkerPreview = true;
      output.onload = function () {
        URL.revokeObjectURL(output.src);
      };
    };

    vm.addLocal = function () {

      vm.openMessageWindow = false;
      // var videoId = '';

      var local = {
        isActive: true,
        type: vm.local.type.name,
        subtype: vm.local.subType,
        title: vm.local.title,
        description: vm.local.description,
        coordinates: {
          latitude: vm.latitude,
          longitude: vm.longitude,
        },
        workers: vm.local.workers,
        ownerUserId: userServiceData.users.id,
        // mainVideoId: videoId
      };

      var videoFile = vm.file;

      var newVideo = {
        name: userServiceData.users.name,
        mail: userServiceData.users.email,
        videoId: '',
        title: vm.local.title,
        description: vm.local.description,
        user_id: userServiceData.users.id,
        place_id: vm.local.subType,
        coordinates: {
          latitude: vm.latitude,
          longitude: vm.longitude
        }
      };

      var formData = new FormData();
      formData.append('file', vm.file);

      // videoService.uploadVideo(formData, vm.local.type, newVideo);

      var workerImagesArray = [];

      vm.local.workers.forEach(function (worker, index) {

        vm.fileWorkerImage = document.forms['add-local']['worker-image' + index].files[0];
        console.log(vm.fileWorkerImage);

        var workerImage = new FormData();
        workerImage.append('file', vm.fileWorkerImage);
        workerImagesArray.push(workerImage);

      });

      if (vm.fileWorkerImage !== undefined) {
        localEcosystemService.addLocalImage(workerImagesArray, local, formData, vm.local.subType, newVideo);
      } else {
        var localJSON = JSON.stringify(local);
        localEcosystemService.addLocal(localJSON, formData, vm.local.subType, newVideo);
      }

      console.log(workerImagesArray);


      if(vm.newVideo.point !== null && vm.file !== undefined && vm.newVideo.terms === true && vm.newVideo.title !== undefined) {


        console.log(videoFile);
        console.log(newVideo);

        vm.successMessage = 'The video has been sent successfully!';
        vm.openMessageWindow = true;
        vm.successUpload = true;

        $timeout(function quitPopup() {
          vm.openMessageWindow = false;
        });

      } else {
        vm.successMessage = 'You must fill all the required fields!';
        vm.openMessageWindow = true;
        vm.successUpload = false;

        $timeout(function quitPopup() {
          vm.openMessageWindow = false;
        });

      }

    };


  }]);
