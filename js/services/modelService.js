angular.module('appFactura.modelService', []).factory('ModelService', function ($q, $http, SucursalesService, ContratosService, FAQService) {

  var ModelService = {
    instance: instance,
    pouch: pouch,
    resetUserData: resetUserData,
    logoutUser: logoutUser,
    destroyLocalData: destroyLocalData,
    findAllDocuments: findAllDocuments,
    getUser: getUser,
    getTerm: getTerm,
    getContratos: getContratos,
    getSucursales: getSucursales,
    getFAQs: getFAQs,
    getVersion: getVersion,
    getInboxes: getInboxes,
    create: create,
    update: update,
    deleteDoc: deleteDoc,
    deleteBatch: deleteBatch,
    updateLastKnownPosition: updateLastKnownPosition,
    getLastKnownPosition: getLastKnownPosition,
    fguidGenerator: fguidGenerator,
    getDateTime: getDateTime
  };

  var self = ModelService; // eslint-disable-line consistent-this
  var _pouch = null;

  return ModelService;

  // //////////////////

  function instance() {
    var deferred = $q.defer();
    if (_pouch) {
      deferred.resolve(self);
    } else {
      _pouch = new PouchDB('cablevisionfibertel-appfactura'); // eslint-disable-line no-undef
      console.log('cablevisionfibertel-appfactura created, using adapter: ' + _pouch.adapter);
      self.getUser().then(function () {
        deferred.resolve(self);
      }).catch(function () {
        deferred.resolve(self);
      });
    }
    return deferred.promise;
  }

  function pouch() {
    var deferred = $q.defer();
    self.instance().then(function () {
      deferred.resolve(_pouch);
    });
    return deferred.promise;
  }

  function resetUserData() {
    var deferred = $q.defer();
    if (_pouch) {
      self.getUser().then(function (user) {
        self.deleteDoc(user);
      }).then(function () {
        self.findAllDocuments('Contrato').then(function (contratos) {
          self.deleteBatch(contratos).then(function () {
            deferred.resolve();
          });
        });
      }).catch(function (err) {
        deferred.reject(err);
      });
    } else {
      deferred.resolve();
    }
    return deferred.promise;
  }

  function logoutUser() {
    var deferred = $q.defer();
    if (_pouch) {
      self.getUser().then(function (user) {
        self.deleteDoc(user);
      }).then(function () {
        self.findAllDocuments('Contrato').then(function (contratos) {
          return self.deleteBatch(contratos);
        }).then(function () {
          deferred.resolve();
        });
      }).catch(function (err) {
        deferred.reject(err);
      });
    } else {
      deferred.resolve();
    }
    return deferred.promise;
  }

  function destroyLocalData() {
    var deferred = $q.defer();
    self.pouch()
      .then(function (db) {
        return db.destroy();
      })
      .then(function (response) {
        _pouch = null;
        deferred.resolve();
      })
      .catch(function (err) {
        console.log('Error al borrar la pouchdb: ' + JSON.stringify(err));
        deferred.reject(err);
      });
    return deferred.promise;
  }

  function findAllDocuments(tipo) {
    var defer = $q.defer();
    self.pouch()
      .then(function (p) {
        return p.allDocs({
          include_docs: true, // eslint-disable-line camelcase
          attachments: true,
          descending: true,
          endkey: tipo + '_',
          startkey: tipo + '\uffff'
        });
      })
      .then(function (result) {
        defer.resolve(result.rows.map(function (elem) {
          return elem.doc;
        }));
      })
      .catch(function (err) {
        console.log(JSON.stringify(err));
        defer.reject(err);
      });
    return defer.promise;
  }

  function getUser() {
    var defer = $q.defer();
    self.pouch()
      .then(function (p) {
        return p.get('User_ID');
      })
      .then(function (user) {
        defer.resolve(user);
      })
      .catch(function (err) {
        defer.reject(err);
      });
    return defer.promise;
  }

  function getTerm() {
    var defer = $q.defer();
    self.pouch()
      .then(function (p) {
        return p.get('TerminosYCondiciones_ID');
      })
      .then(function (user) {
        defer.resolve(user);
      })
      .catch(function (err) {
        defer.reject(err);
      });
    return defer.promise;
  }

  function getContratos() {
    var defer = $q.defer();
    self.findAllDocuments('Contrato')
      .then(function (documents) {
        if (documents.length === 0) {
          console.log('No hay contratos en local db. Consulto contratos.');
          self.getUser()
          .then(function (user) {
            ContratosService.getAllContratos(user)
            .then(function (contratos) {
              console.log('Guardo contratos en local db.');
              var contratosResidenciales = [];
              for (var i = 0; i < contratos.length; i++) {
                if (contratos[i]._id !== 'Contrato_Corporativo') {
                  contratosResidenciales.push(contratos[i]);
                  self.create(contratos[i]);
                }
              }
              defer.resolve(contratosResidenciales);
            })
            .catch(function (err) {
              defer.resolve(false);
            });
          });
        } else {
          defer.resolve(documents);
        }
      });
    return defer.promise;
  }

  function getSucursales() {
    var defer = $q.defer();
    self.findAllDocuments('Sucursal')
      .then(function (documents) {
        if (documents.length === 0) {
          console.log('No hay sucursales en local db. Consulto sucursales.');
          SucursalesService.getAllSucursales()
          .then(function (sucursales) {
            defer.resolve(sucursales);
            console.log('Guardo sucursales en local db.');
            for (var i = 0; i < sucursales.length; i++) {
              self.create(sucursales[i]);
            }
          })
          .catch(function (err) {
            defer.resolve(false);
          });
        } else {
          defer.resolve(documents);
        }
      });
    return defer.promise;
  }

  function getFAQs() {
    var defer = $q.defer();
    FAQService.getCurrentVersion().then(function (versionBackend) {
      self.getVersion('FAQ').then(function (versionLocal) {
        if (versionLocal.version < versionBackend.data.version) {
          self.findAllDocuments('FAQ').then(function (faqs) {
            self.deleteBatch(faqs);
          }).then(function () {
            return self.deleteDoc(versionLocal);
          }).then(function () {
            FAQService.getAllFAQs()
            .then(function (faqs) {
              defer.resolve(faqs);
              for (var i = 0; i < faqs.length; i++) {
                self.create(faqs[i]);
              }
            });
          })
          .then(function () {
            self.create({_id: 'FAQVersion_ID', version: versionBackend.data.version});
          })
          .catch(function (err) {
            self.reject(err);
          });

        } else {
          self.findAllDocuments('FAQ')
            .then(function (documents) {
              defer.resolve(documents);
            }).catch(function (err) {
              defer.reject(err);
            });
        }
      });
    });

    FAQService.getDefaultFAQs().then(function (faqs) {
      defer.resolve(faqs);
    }).catch(function (error) {
      defer.reject(error);
    });


    return defer.promise;
  }

  function getVersion(tipo) {
    var defer = $q.defer();
    self.pouch()
      .then(function (p) {
        return p.get(tipo + 'Version_ID');
      })
      .then(function (version) {
        defer.resolve(version);
      })
      .catch(function (err) {
        self.create({_id: tipo + 'Version_ID', version: 0}).then(function (version) {
          defer.resolve(version);
        }).catch(function (error) {
          defer.reject(error);
        });
      });
    return defer.promise;
  }

  function getInboxes() {
    var defer = $q.defer();
    self.findAllDocuments('Inbox').then(function (inboxes) {
      $http({
        method: 'GET',
        url: 'https://onesignal.com/api/v1/notifications?app_id=d21edc73-f6da-42e6-a0ab-241ed8e4766e',
        headers: {
          Authorization : 'Basic Mzg2MzA5MTItMDU5Zi00NDMwLTlkNmUtOTJkNDc3MDBjNTAz'
        }
      }).then(function successCallback(response) {
        if (response.data.notifications) {
          self.getUser().then(function (user) {

            var promises = [];

            for (var i = 0; i < response.data.notifications.length; i++) {
              if (response.data.notifications[i].send_after >= user.timestamp) {
                var inboxDiscarted = true;
                for (var j = 0; j < inboxes.length; j++) {
                  if ((response.data.notifications[i].contents.en === inboxes[j].content)
                  && (response.data.notifications[i].headings.en === inboxes[j].title)) {
                    inboxDiscarted = false;
                    break;
                  }
                }
                if (inboxDiscarted) {
                  var newID = ModelService.fguidGenerator();
                  var newInbox = {
                    _id: 'Inbox_' + newID,
                    id: newID,
                    title: response.data.notifications[i].headings.en,
                    content: response.data.notifications[i].contents.en,
                    date: ModelService.getDateTime()[0],
                    orderDate: ModelService.getDateTime()[1],
                    read: false,
                    removed: false
                  };
                  inboxes.push(newInbox);
                  promises.push(ModelService.create(newInbox));
                }
              }
            }

            $q.all(promises).then(function () {
              console.log(inboxes);
              defer.resolve(inboxes);
            });

          }).catch(function (err) {
            console.log(err);
          });
        }

      }, function errorCallback(error) {
        console.log(error);
        defer.reject(error);
      });

    }).catch(function (err) {
      defer.reject(err);
    });
    return defer.promise;
  }

  function create(object) {
    var defer = $q.defer();
    self.pouch()
      .then(function (p) {
        var doc = object;
        console.log(object);
        return p.put(doc);
      })
      .then(function (response) {
        if (!response.ok) {
          defer.reject(new Error(response));
        } else { // Actualizo el _rev
          object._rev = response.rev;
          defer.resolve(object);
        }
      })
      .catch(function (err) {
        console.log(err);
        defer.reject(err);
      });
    return defer.promise;
  }

  function deleteDoc(object) {
    var defer = $q.defer();
    self.pouch()
      .then(function (p) {
        p.get(object._id).then(function (doc) {
          p.remove(doc).then(function (response) {
            defer.resolve(response);
          }).catch(function (err) {
            defer.reject(err);
          });
        }).catch(function (err) {
          defer.reject(err);
        });
      }).catch(function (err) {
        defer.reject(err);
      });
    return defer.promise;
  }

  function deleteBatch(documents) {
    var defer = $q.defer();
    if (documents.length === 0) {
      defer.resolve(true);
    } else {
      for (var i = 0; i < documents.length; i++) {
        self.deleteDoc(documents[i]).then(function (response) { // eslint-disable-line no-loop-func
          if (i >= (documents.length - 1)) {
            defer.resolve(true);
          }
        }).catch(function (error) {
          defer.reject(error);
        });
      }
    }
    return defer.promise;
  }

  function updateLastKnownPosition(position) {
    console.log('updateLastKnownPosition: ' + position);
    var defer = $q.defer();
    self.getLastKnownPosition().then(function (lkp) {
      var newLastKnownPosition = lkp;
      newLastKnownPosition.position = position;
      self.pouch().then(function (p) {
        p.put(newLastKnownPosition, newLastKnownPosition._id, newLastKnownPosition._rev);
      })
        .then(function (object) {
          defer.resolve(newLastKnownPosition);
        });
    }).catch(function () { // No Existe
      self.create({_id:'LastKnownPosition_ID', position:position})
        .then(function (object) {
          defer.resolve(object);
        })
        .catch(function (err) {
          defer.reject(err);
        });
    });

    return defer.promise;
  }

  function getLastKnownPosition() {
    var defer = $q.defer();
    self.pouch()
      .then(function (p) {
        return p.get('LastKnownPosition_ID');
      })
      .then(function (lkp) {
        defer.resolve(lkp.position);
      })
      .catch(function (err) {
        defer.reject(err);
      });
    return defer.promise;
  }

  function update(object) {
    var defer = $q.defer();
    self.pouch()
      .then(function (p) {
        return p.get(object._id).then(function (response) {
          p.put(object);
          defer.resolve(object);
        });
      })
      .catch(function (err) {
        console.log(err);
        defer.reject(err);
      });
    return defer.promise;
  }

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
});
