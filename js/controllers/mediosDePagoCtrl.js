angular.module('appFactura.controllers')

.controller('MediosDePagoCtrl', function ($scope, $sce, $location, MediosDePagoService, $ionicScrollDelegate, $window) {

  $scope.data = {mediosDePago: []};
  var handle = $ionicScrollDelegate.$getByHandle('contentDelegate');
  var snapshotPositionScroll = 0;

  MediosDePagoService.getMediosDePago().then(function (mediosDePago) {
    $scope.data.mediosDePago = mediosDePago;
  });

  $scope.trustAsHtml = function (string) {
    return $sce.trustAsHtml(string);
  };

  $scope.refreshView = function (medioDePago) {
    if (!medioDePago.expanded) {
      snapshotPositionScroll = handle.getScrollPosition().top;
    }
    medioDePago.expanded = !medioDePago.expanded;
    $ionicScrollDelegate.resize();
  };


  $scope.scrollToTop = function (index, medioDePago) {
    for (var i = 0; i < $scope.data.mediosDePago.length; i++) {
      if ($scope.data.mediosDePago[i].expanded && i !== index) {
        $scope.data.mediosDePago[i].expanded = false;
      }
    }
    $scope.refreshView(medioDePago);
    if (medioDePago.expanded) {
      var item = 'medioDePago' + index;
      $location.hash(item);
      handle.anchorScroll(true);
    } else {
      handle.scrollTo(0, snapshotPositionScroll, true);
    }
  };

  $scope.$on('$ionicView.enter', function () {
    $window.analytics && $window.analytics.pushScreenTagManager && $window.analytics.pushScreenTagManager('Medios de pago', function (response) {
    }, function (error) {
      console.log('[TAG_MANAGER] analytics.pushScreenTagManager error: ' + JSON.stringify(error));
    });
  });

});
