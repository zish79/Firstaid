'use strict';

// Setting up route
angular.module('hcp.users.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('hcp-info', {
          url: '/hcp-info',
          abstract: true,
          template: '<ui-view/>',
          controller: 'HCPController'       
        })
      .state('hcp-info.complete-profile', {
          url: '/complete-profile',
          templateUrl: 'modules/users/client/views/HCP/hcp-complete-profile.client.view.html'
      })
      .state('hcp-info.next-step', {
          url: '/complete-profile-next-step',
          templateUrl: 'modules/users/client/views/HCP/hcp-complete-profile2.client.view.html'
      })
  }
]);