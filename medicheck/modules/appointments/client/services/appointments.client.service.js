//Appointments service used to communicate Appointments REST endpoints
(function () {
  'use strict';

  angular
    .module('appointments')
    .factory('AppointmentsService', AppointmentsService);

  AppointmentsService.$inject = ['$resource'];

  function AppointmentsService($resource) {
    return $resource('api/appointments/:appointmentId', {
      appointmentId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      todaysBookedAppointments: {
            method: 'GET',
            url : 'api/todaysBookedAppointments' ,
            isArray : true 
      },
      patientUpcomingAppointments: {
            method: 'GET',
            url : 'api/patientUpcomingAppointments' ,
            isArray : true 
      },
      dropInWaitingRoom: {
            method: 'GET',
            url : 'api/dropInWaitingRoom' ,
            isArray : true 
      }
    });
  }
})();
