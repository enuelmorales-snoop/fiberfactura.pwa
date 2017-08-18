angular.module('appFactura.loginService', []).factory('LoginService', function ($q, $http, $state, $ionicLoading, $ionicPopup) {

  var LoginService = {
    loginMundoCablevision: loginMundoCablevision,
    getAccessToken: getAccessToken
  };

  var accessToken = null;

  return LoginService;

  // //////////////////

  function loginMundoCablevision(username, password) {
    var deferred = $q.defer();
    try {
      if (navigator.connection.type === Connection.NONE) { // eslint-disable-line no-undef
        $state.go('noConnection');
        deferred.reject();
      } else {
        throw navigator.connection.type;
      }
    } catch (e) {
      $ionicLoading.show({template: 'Iniciando sesión...'});
      $http({
        method: 'POST',
        url: 'https://api.cablevision.com.ar/token',
        timeout: 15000,
        data:{
          grant_type: 'password', // eslint-disable-line camelcase
          username: username,
          password: password
        },
        headers: {
          Authorization : 'Basic ' + btoa('O50Z3irtqfaZJndSMkPuaCawAKga:k1M0Ip_2En3GvNlDkIPvMLBRnkUa'),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        transformRequest: function (obj) {
          var str = [];
          for (var p in obj) { // eslint-disable-line no-restricted-syntax, guard-for-in
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
          }
          return str.join('&');
        }
      }).then(function successCallback(response) {
        console.log(JSON.stringify(response));
        response.data.username = username;
        response.data.password = password;

        window.plugins.OneSignal.getIds(function (ids) {
          $http({
            method: 'GET',
            url: 'https://onesignal.com/api/v1/players/' + ids.userId + '?app_id=d21edc73-f6da-42e6-a0ab-241ed8e4766e',
            headers: {
              Authorization : 'Basic Mzg2MzA5MTItMDU5Zi00NDMwLTlkNmUtOTJkNDc3MDBjNTAz'
            }
          }).then(function successCallbackOneSignal(res) {
            if (res.data.created_at < 1475452800) {
              response.data.timestamp = 1475452800;
            } else {
              response.data.timestamp = res.data.created_at;
            }
            accessToken = response.data.access_token;
            deferred.resolve(response.data);
          }, function errorCallbackOneSignal(error) {
            console.log(error);
            deferred.reject(false);
          });
        });

      }, function errorCallback(error) {
        console.log(JSON.stringify(error));
        if (error.status === 400) {
          $ionicPopup.alert({
            title: 'Error',
            template: 'El nombre de usuario y/o contraseña son inválidos',
            buttons: [{
              text: 'Volver',
              type: 'fibertel-button-red'
            }]
          });
        } else {
          $ionicPopup.alert({
            title: 'Error',
            template: 'No es posible ingresar, por favor revise su conexión a internet o intente nuevamente en unos minutos',
            buttons: [{
              text: 'Volver',
              type: 'fibertel-button-red'
            }]
          });
        }
        deferred.reject(error);
        $ionicLoading.hide();
        navigator.splashscreen.hide();
      });
    }

    return deferred.promise;
  }

  function getAccessToken() {
    return accessToken;
  }
});
