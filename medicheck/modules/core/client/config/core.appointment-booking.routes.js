'use strict';

// Setting up route
angular.module('appointmentBooking').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        // Redirect to 404 when route not found
        $urlRouterProvider.otherwise(function($injector, $location) {
            $injector.get('$state').transitionTo('not-found', null, {
                location: false
            });
        });

        $stateProvider
        .state('appointment-booking', {
        abstract: true,
        url: '/see-a-doctor',
        template: '<ui-view/>'
        })
        .state('appointment-booking.step1', {
        url: '/step1',
        templateUrl: 'modules/core/client/views/appointmentBooking/appointment-booking-step1.client.view.html'
        }
        )
        .state('appointment-booking.step2', {
        url: '/step2',
        templateUrl: 'modules/core/client/views/appointmentBooking/appointment-booking-step2.client.view.html',
        controller: function($scope, $stateParams) {
            $scope.category = $stateParams.category;
        },
        params: {
            category: {}
        }
        })
        .state('appointment-booking.step3', {
        url: '/step3',
        templateUrl: 'modules/core/client/views/appointmentBooking/appointment-booking-step3.client.view.html'
        })
    }
]);
