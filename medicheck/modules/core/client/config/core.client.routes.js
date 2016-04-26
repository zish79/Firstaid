'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });
    
    
    
    

    // Home state routing
    $stateProvider
    .state('home', {
      url: '/',
      //template: 'Hello ',
      controller: ['Authentication', '$state', function (Authentication,$state) {
        if(Authentication.user.userRole)
        {
          if(Authentication.user.userRole[0] === 'patient'){
            $state.go('patient.home');
          }
          else if(Authentication.user.userRole[0] === 'HCP')
          {
            $state.go('hcp.home');
          }
        }
        else
        {
          $state.go('authentication.signin');
        }
      }],
    })
    
    .state('hcp', {
      abstract: true,
      url: '/hcp',
      template: '<ui-view>',
      controller: 'HCPController'
    })
    .state('hcp.home', {
      url: '/home',
      templateUrl: 'modules/core/client/views/home.hcp.view.html'
    })
    .state('not-found', {
      url: '/not-found',
      templateUrl: 'modules/core/client/views/404.hcp.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('bad-request', {
      url: '/bad-request',
      templateUrl: 'modules/core/client/views/400.hcp.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('forbidden', {
      url: '/forbidden',
      templateUrl: 'modules/core/client/views/403.hcp.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('thankyou', {
      url: '/thankyou',
      templateUrl: 'modules/core/client/views/thankyou.client.view.html',
      data: {
        ignoreState: true
      } 
    })
    .state('calendar', {
      url: '/calendar',
      templateUrl: 'modules/core/client/views/calendar.client.view.html',
      data: {
       // ignoreState: true
      } 
    });
  }
]);
