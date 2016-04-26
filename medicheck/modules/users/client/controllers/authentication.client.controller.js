'use strict';

angular.module('users').controller('AuthenticationController', ['$rootScope', '$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator',
  function ($rootScope, $scope, $state, $http, $location, $window, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      if($scope.authentication.user.userRole === 'HCP')
        $location.path('/');
      else if($scope.authentication.user.userRole === 'patient')
        $state.go('patient.home');
    }

    $scope.signup = function (isValid) {
      $scope.error = null;
      

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        // $scope.authentication.user = response;
        if(response.status === 200){
          $state.go('thankyou');
        }

      }).error(function (response) {
        $scope.error = response.message;
      });
        
    };

    $scope.signin = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };
    
    //redirect to a different login page
    $scope.goBankID = function () {
      $state.go('authentication.signupBankID');
    };
    
    //Varify by BankId and then redirect to dashboard/home page
    $scope.signinBankID = function (data) {
      $http.post('/api/auth/signinWithBankId', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        
        if(!response.isNewUser)
        {
          $http.post('/api/auth/signin', $scope.authentication.user).success(function (response) {
            // check for hcp or patient
            if(response.userRole[0] === 'patient'){
              $state.go('patient.home');
            }
            else if(response.userRole[0] === 'HCP')
              $state.go('hcp.home');
          }).error(function (response) {
                $scope.error = response.message;
            });
        }
        else
        { 
          $http.post('/api/auth/signup', $scope.authentication.user).success(function (response) {
            $http.post('/api/auth/signin', $scope.authentication.user).success(function (response) {
              // $scope.authentication.user.isNew = false;
              $rootScope.user = response;
              $scope.authentication.user = response;
              if(response.userRole[0] === 'patient'){
                $state.go('patient-info.complete-profile');
              }
              else if(response.userRole[0] === 'HCP')
                $state.go('hcp-info.complete-profile');
            }).error(function (response) {
                $scope.error = response.message;
              });
          });
        }
        });

        
    };
  }
]);