'use strict';

// Setting up route
angular.module('patient').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        // Redirect to 404 when route not found
        $urlRouterProvider.otherwise(function($injector, $location) {
            $injector.get('$state').transitionTo('not-found', null, {
                location: false
            });
        });

        // Home state routing
        $stateProvider
            .state('patient', {
                abstract: true,
                url: '/patient',
                template: '<ui-view/>',
                controller: 'patientController',
                resolve: {
                    patUpcomingResolve: patientUpcomingAppointments
                },
                })
            .state('patient.home', {
                url: '/home',
                templateUrl: 'modules/core/client/views/home.patient.view.html'
            });
            
            patientUpcomingAppointments.$inject = ['AppointmentsService'];
            function patientUpcomingAppointments(AppointmentsService){
               return AppointmentsService.patientUpcomingAppointments().$promise;
            }
    }
]);
