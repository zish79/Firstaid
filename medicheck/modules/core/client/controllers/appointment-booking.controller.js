'use strict';

angular.module('appointmentBooking').controller('appointmentBookingController', ['$scope', '$state', 'Authentication',
    function($scope, $state, Authentication) {
        // This provides Authentication context.
        if (Authentication.user === "") {
            $state.go("authentication.signin");
            return;
        }
        $scope.authentication = Authentication;
}]);