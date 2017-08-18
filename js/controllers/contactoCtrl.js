angular.module('appFactura.controllers')

.controller('ContactoCtrl', function ($scope, MapService, $window) {

  $scope.$on('$ionicView.beforeEnter', function () {
    MapService.stopMonitoring();

    $window.analytics && $window.analytics.pushScreenTagManager && $window.analytics.pushScreenTagManager('Contacto', function (response) {
    }, function (error) {
      console.log('[TAG_MANAGER] analytics.pushScreenTagManager error: ' + JSON.stringify(error));
    });
  });

});
