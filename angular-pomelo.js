/**
 * Created by Nemo on 15/4/7.
 */
angular.module('angular-pomelo', [])
  .run([function () {
    if (typeof pomelo === 'undefined') {
      throw new Error('pomelo is not defined')
    }
  }])
  .factory('ngPomelo', ['$q', function ($q) {
    var ngPomelo = {};
    ngPomelo.init = function (config) {
      if (!angular.isArray(config.gate) || config.gate.length == 0) {
        throw new Error('gate list must be an array');
      }
      this.config = config;
    };

    ngPomelo.getGate = function () {
      var gate = this.config.gate;
      var index = Math.floor(Math.random() * (gate.length));
      return gate[index];
    };

    ngPomelo.queryEntry = function (uid) {
      var deferred = $q.defer();
      var gate = this.getGate();
      pomelo.init(gate, function () {
        pomelo.request('gate.gateHandler.queryEntry', {
          uid: uid
        }, function (data) {
          pomelo.disconnect();
          if (data.code === 500) {
            deferred.reject(new Error(data));
          } else {
            pomelo.init(data, function () {
              pomelo.request('connector.entryHandler.enter', {uid: uid}, function (data) {
                if (data.error) {
                  deferred.reject(new Error(data.error));
                } else {
                  deferred.resolve(data);
                }
              })
            });
          }
        });
      });
      return deferred.promise;
    };

    return ngPomelo;
  }]);