angular.module('appFactura.controllers')

.controller('SucursalesCtrl', function ($scope, $rootScope, $ionicScrollDelegate, $ionicLoading, $q, ModelService, MapService, $window, $ionicPopup) {
  $scope.data = {
    sucursales: [],
    sucursalesToShow: [],
     buscar : '',
     showDivs: false,
     noResultsFromSearch: false,
     lastKnownPosition: [],
     mapClickable: true,
      slide: false
  };

  $scope.blockMapIfNeeded = function () {
    if ( $scope.data.slide && $scope.data.mapClickable) {
        $scope.data.mapClickable = false;
        MapService.setMapClickable(false);
    } else if (!$scope.data.slide && !$scope.data.mapClickable) {
        $scope.data.mapClickable = true;
        MapService.setMapClickable(true);
    }
  };

  $scope.informMapLoadingError = function () {
    $ionicLoading.hide();
    $ionicPopup.alert({
      title: 'Error',
      template: 'No es posible mostrar las sucursales, por favor revise su conexión a internet o intente nuevamente en unos minutos',
      buttons: [{
        text: 'Volver',
        type: 'fibertel-button-red'
      }]
    });
  };


  $ionicLoading.show({template: 'Cargando...'});
  ModelService.getSucursales()
    .then(function (sucursales) {
      $scope.data.sucursales = sucursales;
      ModelService.getLastKnownPosition().then(function (position) {
        $scope.data.lastKnownPosition = position;
        console.log(position);
      });
      MapService.createMap();
    }, $scope.informMapLoadingError)
    .catch($scope.informMapLoadingError);

  $scope.applyFilter = function () {
    console.log('Aplicar Filtro');
    var matches = $scope.data.sucursales.filter(function (sucursal) {
      if ((sucursal.name.toLowerCase().indexOf($scope.data.buscar.toLowerCase()) !== -1 )
      || (sucursal.address.toLowerCase().indexOf($scope.data.buscar.toLowerCase()) !== -1 )
      || (sucursal.ubicacion.toLowerCase().indexOf($scope.data.buscar.toLowerCase()) !== -1 )) {
        return true;
      }
      return false;
    });

    if (matches.length === 0) {
      $scope.data.noResultsFromSearch = true;
    } else {
      $scope.data.noResultsFromSearch = false;
    }

    $scope.data.sucursalesToShow = matches;
    $scope.reorderSucursales()
    .then(function () {
      $scope.addSucursalesToMap();
    });
  };

  $scope.centerMapInSucursal = function (sucursal) {
    $scope.scrollTop();
    MapService.centerMapInSucursal(sucursal);
    $scope.data.sucursalesToShow[0] = sucursal;
  };

  $scope.scrollTop = function () {
    $ionicScrollDelegate.$getByHandle('sucursales').scrollTop(true);
  };

  $scope.addSucursalesToMap = function () {
    console.log('ADD SUCURSALES TO MAP');
    MapService.addSucursalesToMap($scope.data.sucursalesToShow);
    $scope.data.showDivs = true;
  };

  $scope.getDistanciasToSucursales = function (center) {
    console.log('GET DISTANCIA TO SUCURSALES');
    var distance;
    for (var i = 0; i < $scope.data.sucursales.length; i++) {
      distance = MapService.getDistanceToSucursal(center.latLng,
        new window.plugin.google.maps.LatLng($scope.data.sucursales[i].location[1],
          $scope.data.sucursales[i].location[0]));
      $scope.data.sucursales[i].distance = distance;
      if (distance < 1000) {
        $scope.data.sucursales[i].distanceToShow = parseInt(distance, 10);
        $scope.data.sucursales[i].distanceUnit = 'm';
      } else {
        $scope.data.sucursales[i].distanceToShow = parseInt(distance / 1000, 10);
        $scope.data.sucursales[i].distanceUnit = 'Km';
      }
    }
    $scope.applyFilter();
  };

  $scope.reorderSucursales = function () {
    console.log('REORDER SUCURSALES');
    var defer = $q.defer();
    $scope.data.sucursalesToShow.sort(function (a, b) {
      return a.distance - b.distance;
    });
    defer.resolve(true);
    return defer.promise;
  };

  $scope.isNaN = function (n) {
    return isNaN(n);
  };

  $rootScope.$on('sucursales.scrolled', function (event) {
    document.getElementById('map_canvas').style.backgroundColor = 'rgba(0, 0, 0, ' + (0.5 * $ionicScrollDelegate.$getByHandle('sucursales').getScrollPosition().top / 293) + ')';
    if (($ionicScrollDelegate.$getByHandle('sucursales').getScrollPosition().top === 0) && (!$scope.data.mapClickable)) {
      $scope.data.mapClickable = true;
      MapService.setMapClickable(true);
    } else if (($ionicScrollDelegate.$getByHandle('sucursales').getScrollPosition().top > 0) && ($scope.data.mapClickable)) {
      $scope.data.mapClickable = false;
      MapService.setMapClickable(false);
    }
  });

  $rootScope.$on('inbox-dialog-open', function (event) {
    if ($ionicScrollDelegate.$getByHandle('sucursales').getScrollPosition().top === 0) {
      $scope.data.mapClickable = false;
      MapService.setMapClickable(false);
    }
  });

  $rootScope.$on('inbox-dialog-close', function (event) {
    $rootScope.$emit('sucursales.scrolled');
  });

  $rootScope.$on('map.created', function (event) {
    console.log('MAP CREATED');
    MapService.startMonitoring();
    $ionicLoading.hide();
  });

  $rootScope.$on('geo.new.location', function (event, location) {
    console.log('GEO NEW LOCATION');
    $scope.data.lastKnownPosition = [location.latLng.lat, location.latLng.lng];
    ModelService.updateLastKnownPosition($scope.data.lastKnownPosition);
    $scope.getDistanciasToSucursales(location);
  });

  $rootScope.$on('geo.new.location.error', function (event, location) {
    console.log('GEO NEW LOCATION ERROR!');
    console.log($scope.data.lastKnownPosition);
    var oldLocation = {
      latLng : {
        lat : $scope.data.lastKnownPosition[0],
        lng : $scope.data.lastKnownPosition[1]
      }
    };

    if ($scope.data.lastKnownPosition) {
      $scope.getDistanciasToSucursales(oldLocation);
    } else {
      console.log('No hay lastKnownPosition precargada');
    }
  });

  $scope.$on('$ionicView.beforeEnter', function () {
    $window.analytics && $window.analytics.pushScreenTagManager && $window.analytics.pushScreenTagManager('Sucursales', function (response) {
    }, function (error) {
      console.log('[TAG_MANAGER] analytics.pushScreenTagManager error: ' + JSON.stringify(error));
    });
  });

})

.directive('scrollWatch', function ($rootScope) {
  return {
    restrict: 'A',
    link: function (scope, elem, attr) {
      elem.bind('scroll', function (e) {
        $rootScope.$emit('sucursales.scrolled');
      });
    }
  };
});
