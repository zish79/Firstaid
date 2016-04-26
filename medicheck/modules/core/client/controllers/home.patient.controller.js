'use strict';

angular.module('patient').controller('patientController', ['$scope', '$state', '$timeout', 'Authentication', 'patUpcomingResolve',
    function($scope, $state, $timeout, Authentication,  patUpcomingResolve) {
        // This provides Authentication context.
        if (Authentication.user === "") {
            $state.go("authentication.signin");
            return;
        }
        if (patUpcomingResolve.length != 0){
            $scope.patientUpcomingAppointments = patUpcomingResolve;
            $scope.timeRemain = new Date($scope.patientUpcomingAppointments[0].startTime).valueOf() - new Date().valueOf();
            console.log($scope.patientUpcomingAppointments[0].startTime + '::::' + $scope.timeRemain);
        }
        $scope.authentication = Authentication;
}]);