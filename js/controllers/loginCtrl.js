angular.module('appFactura.controllers')

.controller('LoginCtrl', function ($scope, $window) {

  $scope.data = {loginData: {}, showErrorLogin: false, InAppBrowserReference: ''};

  $scope.$on('$ionicView.beforeEnter', function () {
    $scope.data.loginData.username = '';
    $scope.data.loginData.password = '';
    $scope.data.showErrorLogin = false;
    $window.analytics && $window.analytics.pushScreenTagManager && $window.analytics.pushScreenTagManager('Login', function (response) {
    }, function (error) {
      console.log('[TAG_MANAGER] analytics.pushScreenTagManager error: ' + JSON.stringify(error));
    });
  });

  $scope.getCordovaPath = function () {
    var path = window.location.pathname;
    var phoneGapPath = path.substring(0, path.lastIndexOf('/') + 1);
    return phoneGapPath;
  };

  $scope.openPasswordRecover = function () {
    $scope.InAppBrowserReference = window.open('file://' + $scope.getCordovaPath() + 'templates/passwordRecover.html', '_blank', 'location=no,hardwareback=no,toolbar=no');
    $scope.InAppBrowserReference.addEventListener('loaderror', $scope.closeInAppBrowser);
  };

  $scope.openRegistration = function () {
    $scope.InAppBrowserReference = window.open('file://' + $scope.getCordovaPath() + 'templates/registration.html', '_blank', 'location=no,hardwareback=no,toolbar=no');
    $scope.InAppBrowserReference.addEventListener('loaderror', $scope.closeInAppBrowser);
  };

  $scope.closeInAppBrowser = function (event) {
    if (event.url.match('/close')) {
      $scope.InAppBrowserReference.close();
    }
  };
});
