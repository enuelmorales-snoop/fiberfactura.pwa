angular.module('appFactura.controllers')

.controller('InformacionLegalCtrl', function ($scope, $window) {

  $scope.$on('$ionicView.enter', function () {
    $window.analytics && $window.analytics.pushScreenTagManager && $window.analytics.pushScreenTagManager('Legales', function (response) {
    }, function (error) {
      console.log('[TAG_MANAGER] analytics.pushScreenTagManager error: ' + JSON.stringify(error));
    });
  });

});
