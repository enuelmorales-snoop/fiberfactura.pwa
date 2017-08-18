angular.module('appFactura.mediosDePagoService', []).factory('MediosDePagoService', function ($q, $http) {

  function MedioDePago() {
    this.title = null;
    this.description = null;
    this.expanded = null;
  }

  MedioDePago.prototype.fromJson = function (json) {
    this.title = json.title;
    this.description = json.description;
    this.expanded = json.expanded;
  };

  var MediosDePagoService = {
    getMediosDePago: getMediosDePago,
  };

  return MediosDePagoService;

  function getMediosDePago() {
    var deferred = $q.defer();
    $http.get('resources/medios-de-pago.json')
      .then(function (response) {
        var mediosDePago = response.data.mediosDePago.map(function (row) {
          var medioDePago = new MedioDePago();
          medioDePago.fromJson(row);
          return medioDePago;
        });
        deferred.resolve(mediosDePago);
      }, function (response) {
        deferred.reject(response);
      });
    return deferred.promise;
  }
});
