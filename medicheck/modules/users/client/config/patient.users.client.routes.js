'use strict';

// Setting up route
angular.module('patient.users.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('patient-info', {
        url: '/patient-info',
        abstract: true,
        template: '<ui-view/>',
        controller: 'PatientController',
        resolve: {
          userResolve: ['$stateParams', 'Patient', function ($stateParams, Patient) {
            return Patient.getPatientData({
              userId: $stateParams.userId
            }).$promise;
          }]
        }        
      })
      .state('patient-info.health-profile', {
        url: '/health-profile',
        templateUrl: 'modules/users/client/views/patient/patient-health-profile.client.view.html',
        
      })
      .state('patient-info.edit-profile', {
        url: '/edit-profile',
        templateUrl: 'modules/users/client/views/patient/patient-edit-profile.client.view.html'
      })
      .state('patient-info.complete-profile', {
          url: '/complete-profile',
          templateUrl: 'modules/users/client/views/patient/patient-complete-profile.client.view.html'
      })
      .state('patient-info.next-step', {
          url: '/complete-profile-next-step',
          templateUrl: 'modules/users/client/views/patient/patient-complete-profile2.client.view.html'
      })
      .state('see-doctor-step1', {
        url: '/see-doctor-step1',
        templateUrl: 'modules/users/client/views/patient/see-doctor-step1.client.view.html'
      })
  }
]);
