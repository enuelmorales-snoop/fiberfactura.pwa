angular.module('appFactura.userService', []).factory('UserService', function ($q, $http, LoginService) {

  function User() {
    this._id = null;
    this.subscriberId = null;
    this.name = null;
    this.lastName = null;
    this.mail = null;
    this.dni = null;
    this.nCliente = null;
    this.accessToken = null;
    this.addresses = null;
    this.username = null;
    this.password = null;
  }

  String.prototype.capitalize = function () {  // eslint-disable-line no-extend-native
    var words = this.split(' ');
    for (var i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    return words.join(' ');
  };

  User.prototype.fromJson = function (json) {
    this._id = 'User_ID';
    this.subscriberId = json.identification.subscribeId;
    this.name = json.identification.firstName.toLowerCase().capitalize();
    this.lastName = json.identification.lastName.toLowerCase().capitalize();
    this.mail = json.mail;
    this.dni = json.identification.documentNumber;
    while (json.identification.documentTypeCode.length !== 3) {
      json.identification.documentTypeCode = '0' + json.identification.documentTypeCode;
    }
    this.nCliente = json.identification.documentTypeCode + json.identification.documentNumber;
    this.accessToken = json.accessToken;
    this.username = json.username;
    this.password = json.password;
    this.telephone = '';

    /* Del listado de telefonos del usuario busca el primero que no sea nulo*/
    for (var i = 0; i < json.contactAddress.phoneList.phone.length; i++) {
      if ((json.contactAddress.phoneList.phone[i].localNumber !== '') && (json.contactAddress.phoneList.phone[i].localNumber)) {
        this.telephone = json.contactAddress.phoneList.phone[i].localNumber;
        break;
      }
    }

    this.lastKnownPosition = '';
    this.timestamp = json.timestamp;
  };

  var UserService = {
    getUser: getUser
  };

  return UserService;

  // //////////////////

  function getUser(serviceResponse) {
    var deferred = $q.defer();
    try {
      $http({
        method: 'GET',
        url: 'https://api.cablevision.com.ar/customerManagement/subscribers/' + serviceResponse.data.id,
        headers: {
          Authorization : 'Bearer ' + LoginService.getAccessToken(),
          Accept : 'application/json'
        },
        transformResponse: function (obj) {
          return JSON.parse(obj.replace(/NaN/g, '""'));
        }
      })
      .then(function successCallback(response) {
        console.log(JSON.stringify(response));
        try {
          var user = new User();
          response.data.subscriber.mail = serviceResponse.data.email;
          response.data.subscriber.accessToken = serviceResponse.data.accessToken;
          response.data.subscriber.username = serviceResponse.data.username;
          response.data.subscriber.password = serviceResponse.data.password;
          response.data.subscriber.timestamp = serviceResponse.data.timestamp;
          user.fromJson(response.data.subscriber);
          deferred.resolve(user);
        } catch (e) {
          deferred.reject(e);
        }
      },
        function errorCallback(error) {
          console.log(JSON.stringify(error));
          deferred.reject(error);
        });
    } catch (error) {
      deferred.reject(error);
    }
    return deferred.promise;
  }
});
