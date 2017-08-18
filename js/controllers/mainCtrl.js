angular.module('appFactura.controllers', [])

.controller('MainCtrl', function ($scope, $rootScope, $state, $ionicPopover, $ionicPopup, $ionicHistory, $ionicLoading, $q, $http, ModelService, UserService, Inboxes, LoginService, PdfService, $window, $cordovaGoogleAnalytics) {

  $scope.data = {user: {}, contratos: [], selectedContrato: 0, badgeCount: 0};

  $rootScope.navbarButtonColor = '#2c2c2c';

  $scope.$on('$ionicView.beforeEnter', function () {
    if ($state.current.name === 'tab.home-misDatos') {
      $rootScope.navbarButtonColor = '#f02933';
    } else {
      $rootScope.navbarButtonColor = '#2c2c2c';
    }
  });

  if (ionic.Platform.isAndroid()) {
    $rootScope.marginTopHeaderIcons = '4px';
    $rootScope.paddingTopHeaderUserIcon = '7px';
  } else if (ionic.Platform.isIOS()) {
    $rootScope.marginTopHeaderIcons = '-5px';
    $rootScope.marginTopHeaderUserIcon = '-2px';
  }

  ModelService.instance().then(function (ms) {
    ms.getUser()
    .then(function (user) {
      var username = user.username;
      var password = user.password;
      LoginService.loginMundoCablevision(username, password)
        .then(function (response) {
          ModelService.resetUserData().then(function () {
            $scope.getUserData(response);
          });
        })
        .catch(function (error) {
          $scope.hideSplashScreen();
        });
    })
    .catch(function (error) {
      $state.go('welcome');
      $scope.hideSplashScreen();
    });
  });

  $scope.goToState = function (state) {
    $state.go(state);
  };

  $scope.hideSplashScreen = function () {
    setTimeout(function () {
      navigator.splashscreen.hide();
    }, 500);
  };

  $scope.performLogin = function (username, password) {
    LoginService.loginMundoCablevision(username, password)
      .then(function (response) {
        return $scope.getUserData(response);
      }).then(function () {
        var inboxes = Inboxes.all();
        var loaded = false;
        try {
          for (var i = 0; i < inboxes.length; i++) {
            if (inboxes[i].title === '¡Bienvenido!') {
              loaded = true;
              break;
            }
          }
        } catch (ex) {
          console.log(ex);
        }
        if (!loaded) {
          Inboxes.createNew().then(function () {
            $scope.data.badgeCount = Inboxes.notRead();
          });
        } else {
          $scope.data.badgeCount = Inboxes.notRead();
        }
      })
      .catch(function (error) {
        $scope.hideSplashScreen();
      });
  };

  $scope.getUserData = function (user) {
    var deferred = $q.defer();
    $http({
      method: 'GET',
      url: 'https://api.cablevision.com.ar/me/1.0',
      timeout: 15000,
      headers: {
        Authorization : 'Bearer ' + user.access_token,
        Accept : 'application/json'
      }
    }).then(function successCallback(response) {
      console.log(JSON.stringify(response));
      response.data.accessToken = user.access_token;
      response.data.username = user.username;
      response.data.password = user.password;
      response.data.timestamp = user.timestamp;
      UserService.getUser(response)
      .then(function (userFromService) {
        return ModelService.create(userFromService);
      })
      .then(function (userFromModelService) {
        console.log(JSON.stringify(userFromModelService));
        $scope.data.user = userFromModelService;
        return ModelService.getContratos();
      }).then(function (contratos) {
        if (contratos.length !== 0) {
          $scope.data.contratos = contratos;
          Inboxes.load().then(function () {
            $scope.data.badgeCount = Inboxes.notRead();
            $window.analytics && $window.analytics.pushEventTagManager && $window.analytics.pushEventTagManager('Eventos de usuario', 'Login', 'Login exitoso', function (responseTM) {
            }, function (error) {
              console.log('[TAG_MANAGER] analytics.pushEventTagManager error: ' + JSON.stringify(error));
            });
            $ionicLoading.hide();
            $ionicHistory.clearCache();
            $state.go('tab.home');
            $scope.hideSplashScreen();
            deferred.resolve();
          });
        } else {
          $ionicLoading.hide();
          $ionicHistory.clearCache();
          $scope.hideSplashScreen();
          $ionicPopup.alert({
            title: 'Error',
            template: 'Aplicación disponible solamente para clientes activos de Cablevisión Fibertel',
            buttons: [{
              text: 'Volver',
              type: 'fibertel-button-red'
            }]
          });
          ModelService.logoutUser().then(function () {
            deferred.reject();
          });
        }
      })
      .catch(function (error) {
        $ionicLoading.hide();
        $ionicHistory.clearCache();
        $scope.hideSplashScreen();
        $ionicPopup.alert({
          title: 'Error',
          template: 'No es posible ingresar, por favor revise su conexión a internet o intente nuevamente en unos minutos',
          buttons: [{
            text: 'Volver',
            type: 'fibertel-button-red'
          }]
        });
        console.log(error);
        deferred.reject(error);
      });
    }, function errorCallback(error) {
      console.log(JSON.stringify(error));
      deferred.reject(error);
    });
    return deferred.promise;
  };

  $scope.changeSelectedContrato = function (index) {
    $scope.data.selectedContrato = index;
    $scope.homePopover.hide();
    $scope.facturasPopover.hide();

    $window.analytics && $window.analytics.pushEventTagManager && $window.analytics.pushEventTagManager('Eventos de interaccion', 'Clic en menu', 'Direccion', function (responseTM) {
    }, function (error) {
      console.log('[TAG_MANAGER] analytics.pushEventTagManager error: ' + JSON.stringify(error));
    });
  };

  $scope.logOut = function () {

    $window.analytics && $window.analytics.pushEventTagManager && $window.analytics.pushEventTagManager('Eventos de interaccion', 'Clic en boton', 'Cerrar sesion', function (responseTM) {
    }, function (error) {
      console.log('[TAG_MANAGER] analytics.pushEventTagManager error: ' + JSON.stringify(error));
    });

    ModelService.logoutUser().then(function () {
      $rootScope.$emit('user.logged.out');
      $scope.navbarPopover.hide();
      $state.go('welcome');
    });
  };

  $scope.openPDF = function (factura) {

    $window.analytics && $window.analytics.pushScreenTagManager && $window.analytics.pushScreenTagManager('Factura', function (response) {
    }, function (error) {
      console.log('[TAG_MANAGER] analytics.pushScreenTagManager error: ' + JSON.stringify(error));
    });
    PdfService.readFromFile(factura);
  };

  $ionicPopover.fromTemplateUrl('templates/navbar-popover.html', {
    scope: $scope
  }).then(function (popover) {
    $scope.navbarPopover = popover;
  });

  $ionicPopover.fromTemplateUrl('templates/home-popover.html', {
    scope: $scope
  }).then(function (popover) {
    $scope.homePopover = popover;
  });

  $ionicPopover.fromTemplateUrl('templates/facturas-popover.html', {
    scope: $scope
  }).then(function (popover) {
    $scope.facturasPopover = popover;
  });

  $rootScope.$on('inbox-not-read-changed', function () {
    $scope.data.badgeCount = Inboxes.notRead();
  });

  $rootScope.$on('pdf-saved', function (e, factura) {
    $scope.openPDF(factura);
  });

  $rootScope.$on('close-popovers', function (e, factura) {
    $scope.homePopover.hide();
    $scope.facturasPopover.hide();
  });

  $scope.$on('popover.hidden', function (e) {
    angular.element(document.getElementById('home-header-icon-right')).removeClass('ion-chevron-up');
    angular.element(document.getElementById('home-header-icon-right')).addClass('ion-chevron-down');
    angular.element(document.getElementById('misfacturas-header-icon-right')).removeClass('ion-chevron-up');
    angular.element(document.getElementById('misfacturas-header-icon-right')).addClass('ion-chevron-down');
    if ($state.current.name !== 'tab.home-misDatos') {
      $rootScope.navbarButtonColor = '#2c2c2c';
    }
  });

  $scope.openNavBarPopover = function (e) {
    if ($state.current.name !== 'noConnection') {
      $scope.navbarPopover.show(e);
      $rootScope.navbarButtonColor = '#f02933';
    }
  };

  $scope.openHomePopover = function (e) {
    angular.element(document.getElementById('home-header-icon-right')).removeClass('ion-chevron-down');
    angular.element(document.getElementById('home-header-icon-right')).addClass('ion-chevron-up');
    $scope.homePopover.show(e);

    $window.analytics && $window.analytics.pushEventTagManager && $window.analytics.pushEventTagManager('Eventos de interaccion', 'Clic en menu', 'Direcciones', function (responseTM) {
    }, function (error) {
      console.log('[TAG_MANAGER] analytics.pushEventTagManager error: ' + JSON.stringify(error));
    });
  };

  $scope.openFacturasPopover = function (e) {
    angular.element(document.getElementById('misfacturas-header-icon-right')).removeClass('ion-chevron-down');
    angular.element(document.getElementById('misfacturas-header-icon-right')).addClass('ion-chevron-up');
    $scope.facturasPopover.show(e);

    $window.analytics && $window.analytics.pushEventTagManager && $window.analytics.pushEventTagManager('Eventos de interaccion', 'Clic en menu', 'Direcciones', function (responseTM) {
    }, function (error) {
      console.log('[TAG_MANAGER] analytics.pushEventTagManager error: ' + JSON.stringify(error));
    });
  };
});
