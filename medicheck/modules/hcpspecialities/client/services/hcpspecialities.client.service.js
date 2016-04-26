//Hcpspecialities service used to communicate Hcpspecialities REST endpoints
(function () {
  'use strict';

  angular
    .module('hcpspecialities')
    .factory('HcpspecialitiesService', HcpspecialitiesService);

  HcpspecialitiesService.$inject = ['$resource'];

  function HcpspecialitiesService($resource) {
    return $resource('api/hcpspecialities/:hcpspecialityId', {
      hcpspecialityId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
