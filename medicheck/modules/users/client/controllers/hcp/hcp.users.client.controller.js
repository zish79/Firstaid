'use strict';


angular.module('hcp.users').controller('HCPController', ['$scope', '$state', '$location', 'HCP', 'Authentication', 'Users',
  function ($scope, $state, $location, HCP, Authentication, Users) {    
    $scope.user = Authentication.user;
    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back home
    // if ($scope.authentication.user) {
    //   $location.path('/');
    
    // Find a list of Programs
    $scope.find = function () {
        //$log.info('executing ProgramController.$scope.find');
        self.hcp = HCP.queryByID($scope.userId);
    };

    $scope.remove = function (user) {
      if (confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          $scope.users.splice($scope.users.indexOf(user), 1);
        } else {
          $scope.user.$remove(function () {
            $state.go('hcp.users');
          });
        }
      }
    };

    $scope.save = function (hcp, user) {
          user.$update(user, function () {
            console.log(user);
            $scope.user = user;
          }, function (errorResponse) {
            $scope.error = errorResponse.data.message;
          });
          hcp.$save(function () {
            Authentication.user.isNewUser = false;
            console.log(Authentication.user);
            $state.go('hcp.home');
          }, function (errorResponse) {
            $scope.error = errorResponse.data.message;
          });
        };

    $scope.update = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      //var user = $scope.user;

      user.$update(function () {
        $state.go('hcp.user', {
          userId: user._id
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    
    $scope.hcpBasicInfo = function (userData) {
        console.log($scope.user);
        $state.go('hcp-info.next-step');
    };
    
    $scope.saveHcpInfo = function (hcpData) {
        $scope.user.isNewUser = false;
        var user = new Users($scope.user);
        var hcp = new HCP(hcpData);
        $scope.save(hcp, user);
    }
    
  }
]);





