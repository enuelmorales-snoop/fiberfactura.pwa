angular.module('appFactura.controllers')

.controller('tabsCtrl', function ($scope) {
  $scope.device = '';
  var isTablet = window.matchMedia('only screen and (min-device-width : 768px) and (max-device-width : 1024px)');
  if (isTablet.matches) {
    console.log('Es tablet');
    $scope.device = 'TABLET';
  } else {
    console.log('Es smartphone');
    $scope.device = 'SMARTPHONE';
  }

});
