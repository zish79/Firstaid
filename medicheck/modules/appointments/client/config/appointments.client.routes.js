(function () {
  'use strict';

  angular
    .module('appointments')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('appointments', {
        abstract: true,
        url: '/appointments',
        template: '<ui-view/>'
      })
      .state('appointments.list', {
        url: '',
        templateUrl: 'modules/appointments/client/views/list-appointments.client.view.html',
        controller: 'AppointmentsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Appointments List'
        }
      })
      .state('appointments.create', {
        url: '/create',
        templateUrl: 'modules/appointments/client/views/form-appointment.client.view.html',
        controller: 'AppointmentsController',
        controllerAs: 'vm',
        resolve: {
          appointmentResolve: newAppointment
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Appointments Create'
        }
      })
      .state('appointments.edit', {
        url: '/:appointmentId/edit',
        templateUrl: 'modules/appointments/client/views/form-appointment.client.view.html',
        controller: 'AppointmentsController',
        controllerAs: 'vm',
        resolve: {
          appointmentResolve: getAppointment
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Appointment {{ appointmentResolve.name }}'
        }
      })
      .state('appointments.view', {
        url: '/:appointmentId',
        templateUrl: 'modules/appointments/client/views/view-appointment.client.view.html',
        controller: 'AppointmentsController',
        controllerAs: 'vm',
        resolve: {
          appointmentResolve: getAppointment
        },
        data:{
          pageTitle: 'Appointment {{ articleResolve.name }}'
        }
      });
  }

  getAppointment.$inject = ['$stateParams', 'AppointmentsService'];

  function getAppointment($stateParams, AppointmentsService) {
    return AppointmentsService.get({
      appointmentId: $stateParams.appointmentId
    }).$promise;
  }

  newAppointment.$inject = ['AppointmentsService'];

  function newAppointment(AppointmentsService) {
    return new AppointmentsService();
  }
})();
