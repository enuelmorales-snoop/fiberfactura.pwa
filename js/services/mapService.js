angular.module('appFactura.mapService', []).factory('MapService', function ($timeout, $q, $rootScope, $interval, $ionicPlatform) {

  var MapService = {
    createMap : createMap,
    addSucursalesToMap: addSucursalesToMap,
    centerMapInSucursal: centerMapInSucursal,
    getDistanceToSucursal: getDistanceToSucursal,
    startMonitoring: startMonitoring,
    stopMonitoring: stopMonitoring,
    setMapClickable: setMapClickable
  };

  var selfMap;
  var monitoringPromise;
  var mapCreated = false;

  return MapService;

  // ////////////////////////

  function setMapClickable(value) {
    selfMap.setClickable(value);
  }

  function createMap() {
    console.debug('Creando mapa...');
    console.time('TIMING: MapService.createMap');

    if ( typeof plugin === 'undefined' ) {
      console.info('El plugin map es undefined');
      return;
    }

    var mapDiv = document.getElementById('map_canvas');
    // Workaround porque en la tablet no estaba creando el div a tiempo
    if (mapDiv === null) {
      // Espero un rato hasta q aparezca el div
      console.debug('Esperando div id="map_canvas". Vuelvo a intentar crear el mapa.');
      $timeout(function () {
        createMap();
      }, 1000);
    } else {
      console.debug('MapService: Continue creating map');
      continueCreatingMap(mapDiv);
    }
  }

  function addSucursalesToMap(sucursales) {
    selfMap.clear();
    for (var i = 0; i < sucursales.length; i++) {
      if (i < 5) {
        var sucursal = sucursales[i];

        if ( typeof sucursal.location === 'undefined' || !sucursal.location || sucursal.location === null || sucursal.location === 'null' ) {
          console.log('Skipping one unlocated marker. location = ' + JSON.stringify(sucursal.location));
          continue;
        }

        if ( typeof sucursal.location === 'string' ) {
          try {
            sucursal.location = JSON.parse(sucursal.location);
            if ( typeof sucursal.location !== 'object' || sucursal.location.length !== 2 ) {
              console.log('Después de parsear una location, no es un array sino: ' + JSON.stringify(sucursal.location));
              continue;
            }
          } catch (e) {
            console.log('Exception al parsear la location ' + sucursal.location + ' error: ' + JSON.stringify(e));
            continue;
          }
        }

        if ( typeof plugin !== 'undefined' ) {
          var markerPos = new window.plugin.google.maps.LatLng(sucursal.location[1], sucursal.location[0]);
          var markerOpts = {
            position: markerPos,
            title: sucursal.name + '\n'
            + (typeof sucursal.address === 'undefined' ? '' : ( 'Dirección: ' + sucursal.address + '\n'))
            + (typeof sucursal.phone === 'undefined' ? '' : ( 'Tel: ' + sucursal.phone + '\n' )),
            markerClick: function (marker) {
            },
            infoClick: function (marker) {
            },
            sucursal : sucursal
          };
          selfMap.addMarker(markerOpts, function (marker) {
          });
        }
      }
    }
  }

  function centerMapInSucursal(sucursal) {
    selfMap.animateCamera({
      target: new window.plugin.google.maps.LatLng(sucursal.location[1], sucursal.location[0]),
      zoom: 14,
      duration: 2000
    }, function () {
      console.debug('MapService.centerMapInSucursal: ' + JSON.stringify(sucursal));
    });
  }

  function getDistanceToSucursal(p1, p2) {
    function rad(x) {
      return x * Math.PI / 180;
    }

    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad(p2.lat - p1.lat);
    var dLong = rad(p2.lng - p1.lng);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat))
    * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter
  }

  function startMonitoring() {
    if (mapCreated) {
      console.debug('MapService.startMonitoring(60s)');
      $ionicPlatform.ready(function () {
        acquirePosition();
        monitoringPromise = $interval(acquirePosition, 60000);
      });
    }
  }

  function stopMonitoring() {
    $interval.cancel(monitoringPromise);
  }

  function acquirePosition() {
    console.debug('MapService.acquirePosition');
    selfMap.getMyLocation(onGetMyNewLocationSuccess, onGetMyLocationError);
  }

  function continueCreatingMap(mapDiv) {
    var SNOOP_BSAS = new window.plugin.google.maps.LatLng(-34.602219, -58.409438);
    // Initialize the map plugin

    selfMap = window.plugin.google.maps.Map.getMap(mapDiv, {
      backgroundColor: 'white',
      mapType: window.plugin.google.maps.MapTypeId.ROADMAP,
      controls: {
        compass: true,
        myLocationButton: true,
        indoorPicker: true,
        zoom: true
      },
      gestures: {
        scroll: true,
        tilt: true,
        rotate: true,
        zoom : true
      },
      camera: {
        latLng: SNOOP_BSAS,
        zoom: 4,
        bearing: 0
      }
    });

    selfMap.on(window.plugin.google.maps.event.MAP_READY, onMapInit);

    if ( ionic.Platform.isAndroid() ) {
      selfMap.on(window.plugin.google.maps.event.CAMERA_CHANGE, onNewLocation);
    }
    if ( ionic.Platform.isIOS() ) {
      selfMap.on(window.plugin.google.maps.event.CAMERA_IDLE, onNewLocation);
    }
  }

  function onNewLocation(location) {
    if ( typeof selfMap.getVisibleRegion != 'undefined') {
      $timeout(function () {
        selfMap.getVisibleRegion(function (latLngBounds) {
          console.info('mapService: @zoom: ' + location.zoom + ' Visible region: ne: ' + latLngBounds.northeast.toUrlValue() + ',  sw: ' + latLngBounds.southwest.toUrlValue());
        });
      }, 1);
    }

  }

  function onMapInit(map) {
    console.debug('MapService: map ready: ' + JSON.stringify(map));
    console.timeEnd('TIMING: MapService.createMap');
    console.time('TIMING: MapService.getMyLocation');
    map.getMyLocation(onGetMyLocationSuccess, onGetMyLocationError);
    mapCreated = true;
    $rootScope.$emit('map.created');
  }

  function onGetMyLocationSuccess(location) {
    console.debug('MapService: ubicación actual: ' + JSON.stringify(location));
    console.timeEnd('TIMING: MapService.getMyLocation');

    console.time('TIMING: MapService.animateCamera');
    $rootScope.$emit('geo.new.location', location);
    selfMap.animateCamera({
      target: new window.plugin.google.maps.LatLng(location.latLng.lat, location.latLng.lng),
      zoom: 14,
      duration: 5000
    }, function () {
      console.timeEnd('TIMING: MapService.animateCamera');
    });
  }

  function onGetMyNewLocationSuccess(location) {
    $rootScope.$emit('geo.new.location', location);
  }

  function onGetMyLocationError(err) {
    $rootScope.$emit('geo.new.location.error', location);
    console.error('MapService: No pude obtener la ubicación actual: ' + JSON.stringify(err));
  }

});
