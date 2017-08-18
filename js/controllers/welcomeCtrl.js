angular.module('appFactura.controllers')

.controller('WelcomeCtrl', function ($scope, $state, ModelService, $window, $ionicPlatform) {

  $scope.data = {terminosYCondicionesAccepted : false};

  $scope.acceptTerminosYCondiciones = function () {
    var terms = {_id:'TerminosYCondiciones_ID'};
    ModelService.create(terms)
    .then(function () {
      $state.go('login');
    })
    .catch(function (error) {
      console.log(JSON.stringify(error));
    });
  };

  $scope.goToLogin = function () {
    ModelService.getTerm()
    .then(function () {
      $state.go('login');
    })
    .catch(function () {
      $state.go('terminosYCondiciones');
      $window.analytics && $window.analytics.pushScreenTagManager && $window.analytics.pushScreenTagManager('Terminos y condiciones', function (response) {
      }, function (error) {
        console.log('[TAG_MANAGER] analytics.pushScreenTagManager error: ' + JSON.stringify(error));
      });
    });
  };

  $scope.$on('$ionicView.enter', function () {
    $window.analytics && $window.analytics.pushScreenTagManager && $window.analytics.pushScreenTagManager('Bienvenida', function (response) {
    }, function (error) {
      console.log('[TAG_MANAGER] analytics.pushScreenTagManager error: ' + JSON.stringify(error));
    });
  });

  $ionicPlatform.registerBackButtonAction(function (event) {
    if ($state.current.name === 'welcome' || $state.current.name === 'tab.home') {
      console.log('[Welcome]. salgo de la app');
      navigator.app.exitApp();
    } else {
      console.log('[Welcome]. hago un back.');
      navigator.app.backHistory();
    }
  }, 100);
});
