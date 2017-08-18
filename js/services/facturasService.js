angular.module('appFactura.facturasService', []).factory('FacturasService', function ($q, $http, LoginService) {

  function Factura() {
    this._id = null;
    this.nFactura = null;
    this.vencimiento = null;
    this.importe = null;
    this.balance = null;
    this.link = null;
  }

  Factura.prototype.fromJson = function (json) {
    this._id = 'Factura_' + json.invoiceId;
    this.nFactura = json.contextId + '-' + json.fiscalId;
    this.vencimiento = json.dueDate.split('T')[0].split('-')[2] + '-' + json.dueDate.split('T')[0].split('-')[1] + '-' + json.dueDate.split('T')[0].split('-')[0];
    this.importe = json.extendedAmount;
    this.link = json.pdfResource;
  };

  var FacturasService = {
    getAllFacturas: getAllFacturas
  };

  return FacturasService;

  // //////////////////

  function getAllFacturas(nReferenciaDePago) {
    var deferred = $q.defer();
    $http({
      method: 'GET',
      url: 'https://api.cablevision.com.ar/billingManagement/subscriptions/' + nReferenciaDePago + '/invoices',
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
        var facturas = [];
        facturas = response.data.invoiceList.invoice.map(function (row) {
          var factura = new Factura();
          factura.fromJson(row);
          return factura;
        });

        // La ultima factura que no tenga vencimiento no se muestra
        if (facturas[0].vencimiento === '' || facturas[0].vencimiento === 'undefined-undefined-' || facturas[0].importe === '') {
          console.log('facturaService.Factura sin vencimiento con nro BORRADA: ' + facturas[0].nFactura);
          facturas.splice(0, 1);
        }

        deferred.resolve(facturas);
      },
      function errorCallback(error) {
        console.log(error);
        deferred.reject(error);
      });
    return deferred.promise;
  }
});
