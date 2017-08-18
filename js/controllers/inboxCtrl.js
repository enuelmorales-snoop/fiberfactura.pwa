angular.module('appFactura.controllers')

.controller('InboxCtrl', function ($scope, $rootScope, $ionicScrollDelegate, Inboxes, $window, $cordovaGoogleAnalytics) {

  $scope.inboxes = Inboxes.all();

  $scope.isEmptyBox = true;

  $scope.$on('$ionicView.enter', function () {
    $scope.inboxes = Inboxes.all();
    $scope.data.badgeCount = 0;
  });

  $scope.$on('$ionicView.enter', function () {
    $window.analytics && $window.analytics.pushScreenTagManager && $window.analytics.pushScreenTagManager('Notificaciones', function (response) {
    }, function (error) {
      console.log('[TAG_MANAGER] analytics.pushScreenTagManager error: ' + JSON.stringify(error));
    });
  });

  $rootScope.$on('user.logged.out', function () {
    $scope.inboxes = [];
  });

  $scope.emptyInBox = function () {
    if ($scope.inboxes.length >= 1) {
      var vacio = true;
      for (var i = 0; i < $scope.inboxes.length; i++) {
        if ($scope.inboxes[i].removed === false) {
          $scope.isEmptyBox = false;
          vacio = false;
          break;
        }
      }
      if (vacio) {
        $scope.isEmptyBox = true;
      }
    } else {
      $scope.isEmptyBox = true;
    }
    return $scope.isEmptyBox;
  };

  $scope.markAsRead = function (inbox) {
    if (!inbox.read) {
      Inboxes.update(inbox);
    }
  };

  $scope.remove = function (inbox) {
    $window.analytics && $window.analytics.pushEventTagManager && $window.analytics.pushEventTagManager('Eventos de interaccion', 'Clic en boton', 'Eliminar', function (responseTM) {
    }, function (error) {
      console.log('[TAG_MANAGER] analytics.pushEventTagManager error: ' + JSON.stringify(error));
    });
    Inboxes.remove(inbox);
  };

})

.controller('InboxDetailCtrl', function ($scope, $stateParams, Inboxes, $window) {
  $scope.inbox = Inboxes.get($stateParams.inboxId);

  $scope.$on('$ionicView.enter', function () {
    $window.analytics && $window.analytics.pushScreenTagManager && $window.analytics.pushScreenTagManager('Notificaciones detalle', function (response) {
    }, function (error) {
      console.log('[TAG_MANAGER] analytics.pushScreenTagManager error: ' + JSON.stringify(error));
    });
  });
});
