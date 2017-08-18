angular.module('appFactura.inboxService', [])

.factory('Inboxes', function ($q, $rootScope, $state, ModelService) {

  var inboxes = [];
  var notRead = 0;

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

  return {
    all: function () {
      return inboxes;
    },
    notRead : function () {
      return notRead;
    },
    remove: function (inbox) {
      if (inbox.read === false) {
        notRead = notRead - 1;
      }
      inbox.read = true;
      inbox.removed = true;
      inbox.$$hashKey = null;
      ModelService.update(inbox).then(function (response) {
        console.log(response);
      }).catch(function (err) {
        console.log(err);
      });
    },
    get: function (inboxId) {
      for (var i = 0; i < inboxes.length; i++) {
        if (inboxes[i].id === inboxId) {
          return inboxes[i];
        }
      }
      return null;
    },
    push: function (inbox) {
      inboxes.push(inbox);
      if (inbox.read === false) {
        notRead = notRead + 1;
      }
      if ($state.current.name !== 'tab.inbox') {
        $rootScope.$emit('inbox-not-read-changed');
      }
    },
    load: function () {
      var deferred = $q.defer();
      ModelService.getInboxes().then(function (array) {
        console.log(JSON.stringify(array));
        inboxes = [];
        notRead = 0;
        for (var i = 0; i < array.length; i++) {
          inboxes.push(array[i]);
          if (!array[i].read) {
            notRead = notRead + 1;
          }
        }
        deferred.resolve();
      }).catch(function (err) {
        deferred.reject(err);
      });
      return deferred.promise;
    },
    update: function (inbox) {
      if (inbox.read === false) {
        notRead = notRead - 1;
      }
      inbox.read = true;
      inbox.$$hashKey = null;
      ModelService.update(inbox).then(function (response) {
        console.log(response);
      }).catch(function (err) {
        console.log(err);
      });

    },
    createNew: function () {
      var deferred = $q.defer();
      var newID = fguidGenerator();
      var newInbox = {
        _id: 'Inbox_' + newID,
        id: newID,
        title: '¡Bienvenido!',
        content: 'Con esta app vas a poder ver tus últimas 12 facturas, conocer tu estado de cuenta y realizar pagos telefónicos.',
        date: getDateTime()[0],
        orderDate: getDateTime()[1],
        read: false,
        removed: false
      };
      ModelService.create(newInbox).then(function () {
        inboxes.push(newInbox);
        notRead = notRead + 1;
        if ($state.current.name !== 'tab.inbox') {
          $rootScope.$emit('inbox-not-read-changed');
        }
        deferred.resolve();
      }).catch(function (err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }
  };
});
