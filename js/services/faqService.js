angular.module('appFactura.faqService', []).factory('FAQService', function ($q, $http) {

  function FAQ() {
    this._id = null;
    this.question = null;
    this.answer = null;
  }

  FAQ.prototype.fromJson = function (json) {
    this._id = 'FAQ_' + JSON.stringify(json._id);
    this.question = json.question;
    this.answer = json.answer;
  };

  var FAQService = {
    getAllFAQs: getAllFAQs,
    getCurrentVersion: getCurrentVersion,
    getDefaultFAQs: getDefaultFAQs
  };

  return FAQService;

  // //////////////////

  function getAllFAQs() {
    var deferred = $q.defer();
    $http({
      method: 'GET',
      url: 'http://192.168.183.28:59080/factura-api/rest/faqs'
    })
      .then(function successCallback(response) {
        console.log('FAQs RESPONSE');
        console.log(JSON.stringify(response));
        var faqs = response.data.map(function (row) {
          var faq = new FAQ();
          faq.fromJson(row);
          return faq;
        });
        console.log('faqs: ' + faqs);
        deferred.resolve(faqs);
      },
      function errorCallback(error) {
        console.log('faqs error');
        console.log(error);
        deferred.reject(error);
      });
    console.log('TERMINO DE CONSULTAR FAQs');
    return deferred.promise;
  }

  function getCurrentVersion() {
    var deferred = $q.defer();
    $http({
      method: 'GET',
      url: 'http://192.168.183.28:59080/factura-api/rest/faqs/version'
    })
      .then(function successCallback(response) {
        console.log('FAQsVersion RESPONSE');
        console.log(JSON.stringify(response));
        deferred.resolve(response);
      },
      function errorCallback(error) {
        console.log(error);
        deferred.reject(error);
      });
    console.log('TERMINO DE CONSULTAR FAQs VERSION');
    return deferred.promise;
  }

  function getDefaultFAQs() {
    var deferred = $q.defer();
    $http.get('resources/default-faqs.json')
      .then(function (response) {
        var defaultFAQs = response.data.defaultFAQs.map(function (row) {
          var defaultFAQ = new FAQ();
          defaultFAQ.fromJson(row);
          return defaultFAQ;
        });
        deferred.resolve(defaultFAQs);
      }, function (response) {
        deferred.reject(response);
      });
    return deferred.promise;
  }
});
