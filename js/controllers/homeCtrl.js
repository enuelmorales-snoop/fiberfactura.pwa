angular.module('appFactura.controllers')

.controller('HomeCtrl', function ($scope, $window, $cordovaGoogleAnalytics) {

  $scope.$on('$ionicView.enter', function () {
    $window.analytics && $window.analytics.pushScreenTagManager && $window.analytics.pushScreenTagManager('Homepage', function (response) {
    }, function (error) {
      console.log('[TAG_MANAGER] analytics.pushScreenTagManager error: ' + JSON.stringify(error));
    });
  });

  $scope.trackEventPagoTelefonico = function () {
    $window.analytics && $window.analytics.pushEventTagManager && $window.analytics.pushEventTagManager('Eventos de interaccion', 'Clic en boton', 'Pago telefonico', function (responseTM) {
    }, function (error) {
      console.log('[TAG_MANAGER] analytics.pushEventTagManager error: ' + JSON.stringify(error));
    });
  };

});
