'use strict';

angular.module('core').controller('HCPController', ['$scope', '$state', 'Authentication','AppointmentsService',
    function($scope, $state, Authentication,AppointmentsService) {
        // This provides Authentication context.
        if (Authentication.user === "") {
            $state.go("authentication.signin");
            return;
        }
        if (AppointmentsService.todaysBookedAppointments().length != 0){
            $scope.todaysBookedAppointments = AppointmentsService.todaysBookedAppointments();        
            console.log($scope.todaysBookedAppointments);
        }
        if (AppointmentsService.todaysBookedAppointments().length != 0){
            $scope.dropInWaitingRoom = AppointmentsService.dropInWaitingRoom();
            console.log($scope.dropInWaitingRoom);
        }
        $scope.authentication = Authentication;

    }
]);
