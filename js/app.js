// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('appFactura', ['ionic', 'appFactura.controllers', 'appFactura.modelService', 'appFactura.pdfService', 'appFactura.loginService', 'appFactura.userService', 'appFactura.facturasService', 'appFactura.contratosService', 'appFactura.faqService', 'appFactura.mapService', 'appFactura.sucursalesService', 'appFactura.inboxService', 'appFactura.mediosDePagoService', 'ngCordova'])

.run(function ($ionicPlatform, $state, $ionicPopup, $rootScope, ModelService, Inboxes, $window,
  $cordovaGoogleAnalytics) {
  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      window.StatusBar.styleDefault();
    }

    if ( $window.analytics ) {
      $cordovaGoogleAnalytics.startTrackerWithId('UA-36276739-12');
      $cordovaGoogleAnalytics.setUserId('auto');
      $cordovaGoogleAnalytics.trackView('Home Screen');
      $window.analytics.initTagManager('GTM-NK9CW2', function (response) {
        $window.analytics && $window.analytics.pushScreenTagManager && $window.analytics.pushScreenTagManager('Splash', function (psresponse) {
        }, function (error) {
          console.log('[TAG_MANAGER] analytics.pushScreenTagManager error: ' + JSON.stringify(error));
        });
      }, function (error) {
        console.log('[TAG_MANAGER] analytics.pushScreenTagManager error: ' + JSON.stringify(error));
      });
    }

    console.timeEnd('TIMING: app INIT');

    function fguidGenerator() {
      function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line no-bitwise
      }
      return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
    }

    function getDateTime() {
      var today = new Date();

      var dd = today.getDate();
      if (dd < 10) {
        dd = '0' + dd;
      }

      var mm = today.getMonth() + 1;
      if (mm < 10) {
        mm = '0' + mm;
      }

      var yyyy = today.getFullYear();

      var hh = today.getHours();
      if (hh < 10) {
        hh = '0' + hh;
      }

      var min = today.getMinutes();
      if (min < 10) {
        min = '0' + min;
      }

      var sec = today.getSeconds();
      if (sec < 10) {
        sec = '0' + sec;
      }

      var month = null;

      switch (today.getMonth() + 1) {
        case 1: { month = 'ENE'; break; }
        case 2: { month = 'FEB'; break; }
        case 3: { month = 'MAR'; break; }
        case 4: { month = 'ABR'; break; }
        case 5: { month = 'MAY'; break; }
        case 6: { month = 'JUN'; break; }
        case 7: { month = 'JUL'; break; }
        case 8: { month = 'AGO'; break; }
        case 9: { month = 'SEP'; break; }
        case 10: { month = 'OCT'; break; }
        case 11: { month = 'NOV'; break; }
        case 12: { month = 'DIC'; break; }
        default: break;
      }

      var orderDate = yyyy + mm + dd + hh + min + sec + '';

      var dateTime = [dd + '.' + month + '.' + yyyy + ' - ' + hh + '.' + min + ' Hs.', orderDate];

      return dateTime;
    }

    // Callback al abrir la push notification
    function notificationOpenedCallback(jsonData) {
      console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));

      var newID = fguidGenerator();
      var newInbox = {
        _id: 'Inbox_' + newID,
        id: newID,
        title: jsonData.additionalData.title,
        content: jsonData.message,
        date: getDateTime()[0],
        orderDate: getDateTime()[1],
        read: false,
        removed: false
      };

      var loaded = false;
      var inboxes = Inboxes.all();
      try {
        for (var i = 0; i < inboxes.length; i++) {
          if ((jsonData.message === inboxes[i].content)
          && (jsonData.additionalData.title === inboxes[i].title)) {
            loaded = true;
            break;
          }
        }
      } catch (ex) {
        console.log(ex);
      }

      if (!loaded) {
        ModelService.getUser()
        .then(function (user) {
          ModelService.create(newInbox).then(function () {
            Inboxes.push(newInbox);
            if ($state.current.name !== 'tab.inbox') {
              if ($state.current.name === 'sucursales') {
                $rootScope.$emit('inbox-dialog-open');
              }
              $ionicPopup.alert({
                title: '¡Nuevo mensaje!',
                template: '¿Desea ir a la Bandeja de Entrada?',
                buttons: [{
                  text: 'No',
                  type: 'fibertel-button-grey',
                  onTap: function (e) {
                    if ($state.current.name === 'sucursales') {
                      $rootScope.$emit('inbox-dialog-close');
                    }
                  }
                }, {
                  text: 'Sí',
                  type: 'fibertel-button-red',
                  onTap: function (e) {
                    $rootScope.$emit('close-popovers');
                    if ($state.current.name === 'sucursales') {
                      $rootScope.$emit('inbox-dialog-close');
                    }
                    $state.go('tab.inbox');
                  }
                }]
              });
            }
          });
        }).catch(function (err) {
          console.log('No muestro cartel de nuevo msj porque no está logueado');
        });
      }
    }

    // API Key Nueva cuenta de Clientes Cablevision
    window.plugins.OneSignal.init('d21edc73-f6da-42e6-a0ab-241ed8e4766e', {googleProjectNumber: '664770841958'}, notificationOpenedCallback);

    // OFF - Show an alert box if a notification comes in when the user is in your app.
    window.plugins.OneSignal.enableInAppAlertNotification(false);


  });
})

.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.views.transition('ios');
  $ionicConfigProvider.scrolling.jsScrolling(false);


  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('welcome', {
    url: '/welcome',
    templateUrl: 'templates/welcome.html',
    controller: 'WelcomeCtrl'
  })

  .state('terminosYCondiciones', {
    url: '/terminosYCondiciones',
    templateUrl: 'templates/terminosYCondiciones.html',
    controller: 'WelcomeCtrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  .state('tab.sucursales', {
    url: '/contacto/sucursales',
    views: {
      'tab-contacto': {
        templateUrl: 'templates/sucursales.html',
        controller: 'SucursalesCtrl'
      }
    }
  })

  .state('noConnection', {
    url: '/noConnection',
    templateUrl: 'templates/noConnection.html'
  })

  // setup an abstract state for the tabs directive
    .state('tab', {
      url: '/tab',
      abstract: true,
      controller: 'tabsCtrl',
      templateUrl: 'templates/tabs.html'
    })

  // Each tab has its own nav history stack:

  .state('tab.misFacturas', {
    url: '/misFacturas',
    views: {
      'tab-misFacturas': {
        templateUrl: 'templates/tab-misFacturas.html',
        controller: 'MisFacturasCtrl'
      }
    }
  })

  .state('tab.misFacturas-mediosDePago', {
    url: '/misFacturas/mediosDePago',
    views: {
      'tab-misFacturas': {
        templateUrl: 'templates/mediosDePago.html',
        controller: 'MediosDePagoCtrl'
      }
    }
  })

  .state('tab.home-pago-telefonico', {
    url: '/pago-telefonico',
    views: {
      'tab-home': {
        templateUrl: 'templates/pago-telefonico.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('tab.inbox', {
    url: '/inbox',
    views: {
      'tab-inbox': {
        templateUrl: 'templates/tab-inbox.html',
        controller: 'InboxCtrl'
      }
    }
  })
    .state('tab.inbox-detail', {
      url: '/inbox/:inboxId',
      views: {
        'tab-inbox': {
          templateUrl: 'templates/inboxDetail.html',
          controller: 'InboxDetailCtrl'
        }
      }
    })

  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-home.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('tab.home-misDatos', {
    url: '/home/misDatos',
    views: {
      'tab-home': {
        templateUrl: 'templates/misDatos.html',
        controller: 'MisDatosCtrl'
      }
    }
  })

  .state('tab.faq', {
    url: '/faq',
    views: {
      'tab-faq': {
        templateUrl: 'templates/tab-faq.html',
        controller: 'FaqCtrl'
      }
    }
  })

  .state('tab.faq-informacionLegal', {
    url: '/informacionLegal',
    views: {
      'tab-faq': {
        templateUrl: 'templates/informacionLegal.html',
        controller: 'InformacionLegalCtrl'
      }
    }
  })

  .state('tab.contactoTablet', {
    url: '/contactoT',
    views: {
      'tab-contacto-tablet': {
        templateUrl: 'templates/tab-contacto-tablet.html',
        controller: 'SucursalesCtrl'
      }
    }
  })

  .state('tab.contacto', {
    url: '/contacto',
    views: {
      'tab-contacto': {
        templateUrl: 'templates/tab-contacto.html',
        controller: 'ContactoCtrl'
      }
    }
  })
  ;

});
