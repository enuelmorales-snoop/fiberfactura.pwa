angular.module('appFactura.pdfService', []).factory('PdfService', function ($q, $ionicLoading, $rootScope, LoginService, $ionicPopup) {
  var PdfService = {
    readFromFile: readFromFile,
    showPDFWithoutDownload : showPDFWithoutDownload
  };

  var ANDROID_V_4_4 = 4.4;

  function errorHandler(factura, e) {
    var msg = '';

    switch (e.code) {
      case FileError.QUOTA_EXCEEDED_ERR:
        msg = 'Storage quota exceeded';
        break;
      case FileError.NOT_FOUND_ERR: {
        msg = 'File not found';
        showPDFWithoutDownload(factura);
        break;
      }
      case FileError.SECURITY_ERR:
        msg = 'Security error';
        break;
      case FileError.INVALID_MODIFICATION_ERR:
        msg = 'Invalid modification';
        break;
      case FileError.INVALID_STATE_ERR:
        msg = 'Invalid state';
        break;
      default:
        msg = 'Unknown error';
        break;
    }

    console.log('Error (' + factura.nFactura + '.pdf): ' + msg);
  }

  return PdfService;


  function writeFileIOS(factura, callback, failureCallback) {
    var path = cordova.file.dataDirectory;
    writeInFileSystem(factura, path, callback, failureCallback);
  }

  function writeFileAndroid(factura, callback, failureCallback) {
    var path = cordova.file.externalRootDirectory + 'Download/';
    writeInFileSystem(factura, path, callback, failureCallback);
  }

  function writeInFileSystem(factura, path, callback, failureCallback) {
    console.log('PDF. Se va a buscar el archivo y escribir');
    window.resolveLocalFileSystemURL(path, function (directoryEntry) {
      directoryEntry.getFile(factura.nFactura + '.pdf', { create: true }, function (fileEntry) {
        fileEntry.createWriter(function (fileWriter) {
          executeRequest(factura)
            .then(function (response) {
              fileWriter.onwriteend = function (e) {
                console.log('PDF. Escribien el archivo  de la factura ' + factura.nFactura + '.pdf completed.' );
                if (typeof callback !== 'undefined') {
                  console.log('PDF. LLamando al callback desde con el pdf bajado.');
                  callback(factura);
                } else {
                  console.log('PDF. Callback no definido en la descarga del archivo.');
                }
              };
              fileWriter.write(response);
            }, failureCallback);
        }, errorHandler.bind(null, factura));
      }, errorHandler.bind(null, factura));
    }, errorHandler.bind(null, factura));

  }


  function showPDFWithoutDownload(factura) {

    if (navigator.connection.type === Connection.NONE) { // eslint-disable-line no-undef
      showNoConnection();
      return;
    }

    console.log('PDF. Yendo a buscar el pdf para visualizarlo' );
    $ionicLoading.show({template: 'Cargando...'});
    var currentPlatformVersion = ionic.Platform.version();
    if (ionic.Platform.isAndroid() && currentPlatformVersion < ANDROID_V_4_4 ) {
      // Si es android 4.2 lo bajo porque la libreria de pdf no funciona con url.
      writeFileAndroid(factura, function (factura) { // eslint-disable-line no-shadow
        var viewerUrl = 'lib/pdfjs/web/viewer.html?file=' + encodeURIComponent(getPathFile(factura)) + '&fake=fake';
        console.log('PDF. Mostrando el pdf para android menor a 4.4' );
        $ionicLoading.hide();
        openWindow(factura, viewerUrl);
      });
    } else {
      executeRequest(factura)
        .then(function (response) {
          var url = URL.createObjectURL(response);
          var viewerUrl = 'lib/pdfjs/web/viewer.html?file=' + encodeURIComponent(url);
          $ionicLoading.hide();
          console.log('PDF. Mostrando el pdf para android mayor 4.4' );
          openWindow(factura, viewerUrl);
        })
        .catch(function () {
          $ionicLoading.hide();
          showNoConnection('Revisá tu conexión y volvé a intentarlo más tarde');
        });
    }
  }

  function manageEventPDF(event, factura, childRef) {

    if (event.url.match('closePDF')) {

      if (childRef !== undefined) { // eslint-disable-line no-undefined
        childRef.close();
      }

      return;
    }

    if (event.url.match('sharePDF')) {
      setTimeout(function () {
        if (factura.shareState === undefined) {  // eslint-disable-line no-undefined
          console.log('PDF. Comienzo a compartir el PDF. Activo el loading...');
          factura.shareState = 'sharing';
          var currentPlatformVersion = ionic.Platform.version();
          if (ionic.Platform.isAndroid() && currentPlatformVersion < ANDROID_V_4_4 ) {
            share(factura, childRef);
          } else {
            writeToFile(factura, function () {
              share(factura, childRef);
            }, function () {
              childRef.executeScript({ code: 'hideLoading();' });
              childRef.close();
              showNoConnection();
              factura.shareState = undefined;  // eslint-disable-line no-undefined
            });
          }
        } else if (factura.shareState === 'shared') {
          console.log('PDF. Comienzo a compartir el PDF. Activo el loading...');
          share(factura, childRef);
        }
      }, 100);
      return;
    }
    if (event.url.match('downloadPDF')) {
      setTimeout(function () {
        if (factura.downloadState === undefined) {  // eslint-disable-line no-undefined
          console.log('PDF. Comienzo a bajar el PDF. Activo el loading...');
          factura.downloadState = 'running';
          writeToFile(factura, function () {
            console.log('PDF. Termino de bajar exitosamente. Desactivo el loading...');
            factura.downloadState = undefined;  // eslint-disable-line no-undefined
            if (ionic.Platform.isAndroid()) {
              childRef.executeScript({ code: 'hideLoading(); showMessageAndroid();' });
            } else {
              childRef.executeScript({ code: 'hideLoading(); showMessageIOS();' });
            }
          }, function () {
            childRef.executeScript({ code: 'hideLoading();' });
            childRef.close();
            showNoConnection();
            factura.downloadState = undefined;  // eslint-disable-line no-undefined
          });
        } else {
          console.log('PDF. Se está bajando la factura ... espere');
        }
        return;
      }, 100);
    }
  }

  function share(factura, childRef) {
    console.log('PDF. Se va a compartir ... ');
    var pathToFile = getPathFile(factura);
    window.plugins.socialsharing.share(null, null, [pathToFile], null,
              function () {
                console.log('PDF. Se va a compartio exitosamente');
                factura.shareState = 'shared';
                childRef.executeScript({ code: 'hideLoading();' });
              }, function () {
                console.log('PDF. Hubo un error al compartir');
                childRef.executeScript({ code: 'hideLoading();' });
              });
  }

  function readFromFile(factura) {
    factura.downloadState = undefined; // eslint-disable-line no-undefined
    factura.shareState = undefined; // eslint-disable-line no-undefined
    var pathToFile = getPathFile(factura);
    window.resolveLocalFileSystemURL(pathToFile, function (fileEntry) {
      showPDF(pathToFile, factura);
    }, errorHandler.bind(null, factura));
  }

  function showPDF(file, factura) {

    var viewerUrl;
    var currentPlatformVersion = ionic.Platform.version();
    if (ionic.Platform.isAndroid() && currentPlatformVersion < ANDROID_V_4_4 ) {
      console.log('PDF. Mostrando el pdf para android menor 4.4' );
      viewerUrl = 'lib/pdfjs/web/viewer.html?file=' + encodeURIComponent(getPathFile(factura)) + '&fake=fake';
    } else {
      console.log('PDF. Mostrando el pdf para android mayor 4.4' );
      viewerUrl = 'lib/pdfjs/web/viewer.html?file=' + encodeURIComponent(file);
    }
    openWindow(factura, viewerUrl);
  }


  function openWindow(factura, viewerUrl) {
    var ref = window.open(viewerUrl, '_blank', 'location=no,hardwareback=no,toolbar=no,zoom=no,disallowoverscroll=yes');
    if (ionic.Platform.isAndroid()) {
      ref.addEventListener('loadstop', function (event) {
        manageEventPDF(event, factura, ref);
      });
    } else {
      ref.addEventListener('loadstart', function (event) {
        manageEventPDF(event, factura, ref);
      });
    }
  }

  function getPathFile(factura) {
    var pathToFile;
    if (ionic.Platform.isAndroid()) {
      pathToFile = cordova.file.externalRootDirectory + 'Download/' + factura.nFactura + '.pdf';
    } else {
      pathToFile = cordova.file.dataDirectory + factura.nFactura + '.pdf';
    }
    return pathToFile;

  }

  function executeRequest(factura) {
    console.log('PDF. Se está ejecutando el request para buscar la factura. ');
    return new Promise(function (resolve, reject) {  // eslint-disable-line no-undef
      var request = new XMLHttpRequest();
      request.open('GET', 'https://api.cablevision.com.ar/' + factura.link, true);
      request.setRequestHeader('Authorization', 'Bearer ' + LoginService.getAccessToken());
      request.responseType = 'blob';
      request.timeout = 15000;
      request.onload = function (e) {
        if (this.status === 200) {
          console.log('PDF. status ' + this.status);
          resolve(this.response);
        }
      };
      request.onerror = reject;
      request.send();
    });
  }


  function showNoConnection(errorText) {
    var text = errorText || 'No es posible descargar el pdf, por favor revise su conexión a internet o intente nuevamente en unos minutos';
    $ionicPopup.alert({
      title: 'Error',
      template: text,
      buttons: [{
        text: 'Volver',
        type: 'fibertel-button-red'
      }]
    });
  }

  function writeToFile(factura, callback, failureCallback) {
    if (ionic.Platform.isAndroid()) {
      writeFileAndroid(factura, callback, failureCallback);
    } else {
      writeFileIOS(factura, callback, failureCallback);
    }
  }
});
