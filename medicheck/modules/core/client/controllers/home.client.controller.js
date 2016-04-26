'use strict';

angular.module('core').controller('HomeController', ['$scope', '$state', 'Authentication','AppointmentsService',
    function($scope, $state, Authentication,AppointmentsService) {
        // This provides Authentication context.
        if (Authentication.user === "") {
            $state.go("authentication.signin");
            return;
        }
        $scope.todaysBookedAppointments = AppointmentsService.todaysBookedAppointments();
        $scope.dropInWaitingRoom = AppointmentsService.dropInWaitingRoom();
        console.log($scope.todaysBookedAppointments);
        console.log($scope.dropInWaitingRoom);
        $scope.authentication = Authentication;
    }
]);