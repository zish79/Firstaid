'use strict';

angular.module('patient.users').factory('Patient', ['$resource',
  function ($resource) {
    return $resource('api/patients/:patientId', { patientId: '@_id'}, {
        update: {
            method: 'PUT'
        },
        getPatientData: {
            method: 'GET',
            url : 'api/userpatient'
        }
    });
  }
]);
