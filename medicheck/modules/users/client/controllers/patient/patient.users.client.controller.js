'use strict';
angular.module('patient.users').controller('PatientController', ['$scope','$state', '$location', 'userResolve', 'Patient', 'Authentication', 'Users',
  function ($scope, $state, $location, userResolve, Patient, Authentication, Users) {
     var rootUrl = false;
    $scope.patient = userResolve;
    $scope.user = Authentication.user;
    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;
    
    $scope.remove = function (user) {
      if (confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          $scope.users.splice($scope.users.indexOf(user), 1);
        } else {
          $scope.user.$remove(function () {
            $state.go('patient.users');
          });
        }
      }
    };
      
    $scope.save = function (patient, user) {
      user.$update(user, function () {
        console.log(user);
        $scope.user = user;
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
      patient.$save(function () {
        Authentication.user.isNewUser = false;
        console.log(Authentication.user);
        $state.go('patient.home');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    
    $scope.update = function (patient, rootUrl) {
      var pat = patient;
      pat.$update(function () {
       if (rootUrl) 
        $state.go('patient.home');
       else 
        $state.go('patient-info.health-profile');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
      
    };
    
    $scope.patientBasicInfo = function (userData, preferredHcpGender) {
        console.log($scope.user);
        $scope.patientHcpGender = preferredHcpGender;
        $state.go('patient-info.next-step');
    };
    
    $scope.savePatientInfo = function (patientData) {
        patientData.preferredHcpGender = $scope.patientHcpGender;
        $scope.user.isNewUser = false;
        var user = new Users($scope.user);
        $scope.save(patientData, user);
    }
  }
]);
