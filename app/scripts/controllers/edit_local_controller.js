'use strict';

/**
 * @ngdoc function
 * @name cocrewVideoRecorderApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cocrewVideoRecorderApp
 */
app.controller('editLocalCtrl', [ 'rootService', '$scope', '$routeParams', '$timeout', 'userServiceData', 'locationService', 'localEcosystemService', 'localEcosystemServiceData', 'leafletMarkerEvents', 'videoService',
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
    vm.localSelected = localEcosystemServiceData.localById;
    vm.local = vm.localSelected;
    console.log(vm.local);

    vm.local.type = vm.localSelected.type;

    var i = 0;
    while (i < vm.typeList.length) {
      if (vm.typeList[i].name === vm.localSelected.type) {
        vm.subTypeList = vm.typeList[i].subtypes;
        break;
      }

      i++;
    }

    vm.local.subType = vm.localSelected.subtype;

    vm.latitude = vm.localSelected.coordinates.latitude;
    vm.longitude = vm.localSelected.coordinates.longitude;

    var video = document.getElementById("preview");
    var input = document.querySelector('input[type=file]');

    vm.inputImage = true;
    vm.newVideo = {};

    vm.getUser = function () {
      return userServiceData.users;
    };

    function getMapData(lat, lng, zoom) {

      if (lat === undefined && lng === undefined) {
        lat = vm.localSelected.coordinates.latitude;
        lng = vm.localSelected.coordinates.longitude;
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

    vm.editLocal = function () {

      vm.openMessageWindow = false;
      var videoId = '';

      if (vm.file !== undefined) {
        videoId = '';
      } else {
        videoId = vm.local.mainVideoId;
      }

      var local = {
        isActive: true,
        type: vm.local.type.name,
        subtype: vm.local.subtype,
        title: vm.local.title,
        description: vm.local.description,
        coordinates: {
          latitude: vm.latitude,
          longitude: vm.longitude,
        },
        workers: vm.local.workers,
        ownerUserId: userServiceData.users.id,
        mainVideoId: videoId
      };

      var videoFile = vm.file;

      var newVideo = {
        name: userServiceData.users.name,
        mail: userServiceData.users.email,
        videoId: videoId,
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

        var fileWorkerImage = document.forms['add-local']['worker-image' + index].files[0];

        var workerImage = new FormData();
        workerImage.append('file', fileWorkerImage);
        workerImagesArray.push(workerImage);

      });

      localEcosystemService.editLocalImage(workerImagesArray, local, $routeParams.local_id, newVideo);
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
