(function () {
  'use strict';

  angular
    .module('hcpspecialities')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('hcpspecialities', {
        abstract: true,
        url: '/hcpspecialities',
        template: '<ui-view/>'
      })
      .state('hcpspecialities.list', {
        url: '',
        templateUrl: 'modules/hcpspecialities/client/views/list-hcpspecialities.client.view.html',
        controller: 'HcpspecialitiesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Hcpspecialities List'
        }
      })
      .state('hcpspecialities.create', {
        url: '/create',
        templateUrl: 'modules/hcpspecialities/client/views/form-hcpspeciality.client.view.html',
        controller: 'HcpspecialitiesController',
        controllerAs: 'vm',
        resolve: {
          hcpspecialityResolve: newHcpspeciality
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Hcpspecialities Create'
        }
      })
      .state('hcpspecialities.edit', {
        url: '/:hcpspecialityId/edit',
        templateUrl: 'modules/hcpspecialities/client/views/form-hcpspeciality.client.view.html',
        controller: 'HcpspecialitiesController',
        controllerAs: 'vm',
        resolve: {
          hcpspecialityResolve: getHcpspeciality
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Hcpspeciality {{ hcpspecialityResolve.name }}'
        }
      })
      .state('hcpspecialities.view', {
        url: '/:hcpspecialityId',
        templateUrl: 'modules/hcpspecialities/client/views/view-hcpspeciality.client.view.html',
        controller: 'HcpspecialitiesController',
        controllerAs: 'vm',
        resolve: {
          hcpspecialityResolve: getHcpspeciality
        },
        data:{
          pageTitle: 'Hcpspeciality {{ articleResolve.name }}'
        }
      });
  }

  getHcpspeciality.$inject = ['$stateParams', 'HcpspecialitiesService'];

  function getHcpspeciality($stateParams, HcpspecialitiesService) {
    return HcpspecialitiesService.get({
      hcpspecialityId: $stateParams.hcpspecialityId
    }).$promise;
  }

  newHcpspeciality.$inject = ['HcpspecialitiesService'];

  function newHcpspeciality(HcpspecialitiesService) {
    return new HcpspecialitiesService();
  }
})();
