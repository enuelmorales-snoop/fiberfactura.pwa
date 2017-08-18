angular.module('appFactura.sucursalesService', []).factory('SucursalesService', function ($q, $http, LoginService) {

  function Sucursal() {
    this._id = null;
    this.name = null;
    this.address = null;
    this.ubicacion = null;
    this.location = null;
    this.phone = null;
    this.distance = null;
    this.distanceToShow = null;
    this.distanceUnit = null;
  }

  Sucursal.prototype.fromJson = function (json) {
    this._id = 'Sucursal_' + json.RowNumber;
    this.name = json.branchOfficeName;
    this.address = json.addressStreetAndDoor;
    this.ubicacion = json.branchOfficeName + ', ' + json.city;
    this.location = [json.longitud, json.latitud];
    this.phone = json.linePhoneNumber;
    this.distance = '';
    this.distanceToShow = '';
    this.distanceUnit = '';
  };

  var SucursalesService = {
    getAllSucursales: getAllSucursales
  };

  return SucursalesService;

  // //////////////////

  function getAllSucursales() {
    var deferred = $q.defer();

    try {
      $http({
        method: 'GET',
        url: 'https://api.cablevision.com.ar/salesManagement/1.0/branchOffices',
        timeout: 15000,
        headers: {
          Authorization : 'Bearer ' + LoginService.getAccessToken(),
          Accept : 'application/json'
        }
      })
    .then(function successCallback(response) {
      var sucursales = response.data.sucursales.sucursal.map(function (row, index) {
        var sucursal = new Sucursal();
        row.RowNumber = index;
        sucursal.fromJson(row);
        return sucursal;
      });
      deferred.resolve(sucursales);
    },
    function errorCallback(error) {
      deferred.reject(error);
    });
    } catch (error) {
      deferred.reject(error);
    }
    console.log('TERMINO DE CONSULTAR SUCURSALES');
    return deferred.promise;
  }
});
