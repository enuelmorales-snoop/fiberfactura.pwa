angular.module('appFactura.contratosService', []).factory('ContratosService', function ($q, $http, FacturasService, LoginService) {

  function Contrato() {
    this._id = null;
    this.nReferenciaDePago = null;
    this.address = null;
    this.facturas = null;
    this.balance = null;
  }

  String.prototype.capitalize = function () {  // eslint-disable-line no-extend-native
    var words = this.split(' ');
    for (var i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    return words.join(' ');
  };

  Contrato.prototype.fromJson = function (json) {
    this._id = 'Contrato_' + json.id;
    this.nReferenciaDePago = json.id;
    var tempAddress = [json.billingAddress.lineOne.replace(/\/ALT\//g, '').replace(/\/DE\//g, 'Dto.').replace(/\/TO\//g, 'Torre').replace(/\/PI\//g, 'Piso')
    .toLowerCase()
    .capitalize(), '', ''];
    if (tempAddress[0].indexOf(' ,av.') !== -1) {
      tempAddress[0] = tempAddress[0].replace(' ,av.', '');
      tempAddress[0] = 'Av. ' + tempAddress[0];
    }
    this.address = tempAddress;
    this.facturas = json.facturas;
    this.balance = json.balance;
  };

  var ContratosService = {
    getAllContratos: getAllContratos
  };

  return ContratosService;

  // //////////////////

  function getAllContratos(user) {
    var deferred = $q.defer();
    try {
      $http({
        method: 'GET',
        url: 'https://api.cablevision.com.ar/customerManagement/subscriptions?subscriberId=' + user.subscriberId,
        headers: {
          Authorization : 'Bearer ' + LoginService.getAccessToken(),
          Accept : 'application/json'
        }
      })
      .then(function successCallback(response) {
        console.log(JSON.stringify(response));
        Promise.all(response.data.contractList.contract.map(function (row) { // eslint-disable-line no-undef
          var defer = $q.defer();
          var contrato = new Contrato();
          FacturasService.getAllFacturas(row.id)
          .then(function (facturas) {
            row.facturas = facturas;
            $http({
              method: 'GET',
              url: 'https://api.cablevision.com.ar/customerManagement/subscriptions/' + row.id + '/balance',
              headers: {
                Authorization : 'Bearer ' + LoginService.getAccessToken(),
                Accept : 'application/json'
              }
            })
            .then(function (balanceResponse) {
              console.log(JSON.stringify(balanceResponse));
              row.balance = balanceResponse.data.balance;
              try {
                if ((row.subscriptionType.id === '1') || (row.subscriptionType.id === '5')) {
                  contrato.fromJson(row);
                  defer.resolve(contrato);
                } else {
                  defer.resolve({_id: 'Contrato_Corporativo'});
                }
              } catch (e) {
                deferred.reject(false);
              }
            });
          });
          return defer.promise;
        }))
        .then(function (contratos) {
          console.log(JSON.stringify(contratos));
          deferred.resolve(contratos);
        });

      },
      function errorCallback(error) {
        console.log(JSON.stringify(error));
        deferred.reject(error);
      });
    } catch (e) {
      deferred.reject(e);
    }
    return deferred.promise;
  }
});
