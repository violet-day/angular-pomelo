angular.module('demo', ['angular-pomelo'])
  .constant('pomeloConfig', {
    gate: [{
      host: '127.0.0.1',
      port: 3014
    }]
  })
  .run(function (ngPomelo, pomeloConfig) {
    ngPomelo.init(pomeloConfig);
    ngPomelo.queryEntry('nemo');
  });