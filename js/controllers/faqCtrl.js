angular.module('appFactura.controllers')

.controller('FaqCtrl', function ($scope, $location, $sce, $ionicScrollDelegate, ModelService, $window) {

  $scope.data = {faqs: []};
  var handle = $ionicScrollDelegate.$getByHandle('contentDelegate');
  var snapshotPositionScroll = 0;

  ModelService.getFAQs().then(function (faqs) {
    $scope.data.faqs = faqs;
  });

  $scope.$on('$ionicView.afterLeave', function () {
    for (var i = 0; i < $scope.data.faqs.length; i++) {
      $scope.data.faqs[i].expanded = false;
    }
  });

  $scope.$on('$ionicView.enter', function () {
    $window.analytics && $window.analytics.pushScreenTagManager && $window.analytics.pushScreenTagManager('Preguntas frecuentes', function (response) {
    }, function (error) {
      console.log('[TAG_MANAGER] analytics.pushScreenTagManager error: ' + JSON.stringify(error));
    });
  });

  $scope.trustAsHtml = function (string) {
    return $sce.trustAsHtml(string);
  };

  $scope.refreshView = function (faq) {
    // capturo el valor top de scroll antes de expandir para luego poder volver a esta posicion
    if (!faq.expanded) {
      snapshotPositionScroll = handle.getScrollPosition().top;
    }
    faq.expanded = !faq.expanded;
    $ionicScrollDelegate.resize();
  };

  $scope.scrollToTop = function (index, faq) {
    for (var i = 0; i < $scope.data.faqs.length; i++) {
      if ($scope.data.faqs[i].expanded && i !== index) {
        $scope.data.faqs[i].expanded = false;
      }
    }
    $scope.refreshView(faq);
    if (faq.expanded) {
      var item = 'faq' + index;
      $location.hash(item);
      handle.anchorScroll(true);
    } else {
      handle.scrollTo(0, snapshotPositionScroll, true);
    }
  };

});
