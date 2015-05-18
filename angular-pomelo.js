/**
 * Created by Nemo on 15/4/7.
 */
angular.module('angular-pomelo', [])
  .run([function () {
    if (angular.isUndefined(pomelo)) {
      throw new Error('pomelo is not defined')
    }
  }])
  .factory('pomelo', ['$q', function ($q) {

    pomelo.initialize = function (config) {
      if (!angular.isArray(config.gate) || config.gate.length == 0) {
        throw new Error('gate list must be an array');
      }
      this.config = config;
    };

    pomelo.getGate = function () {
      var gate = this.config.gate;
      var index = Math.floor(Math.random() * (gate.length));
      return gate[index];
    };

    pomelo.queryEntry = function (body) {
      var deferred = $q.defer();
      var gate = this.getGate();
      pomelo.init(gate, function () {
        pomelo.request('gate.gateHandler.queryEntry', body, function (data) {
          pomelo.disconnect();
          if (data.code === 500) {
            deferred.reject(new Error(data));
          } else {
            pomelo.init(data, function () {
              pomelo.request('connector.entryHandler.enter', body, function (data) {
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

    return pomelo;
  }]);