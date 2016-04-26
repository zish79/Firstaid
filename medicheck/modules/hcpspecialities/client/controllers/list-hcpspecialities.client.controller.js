(function () {
  'use strict';

  angular
    .module('hcpspecialities')
    .controller('HcpspecialitiesListController', HcpspecialitiesListController);

  HcpspecialitiesListController.$inject = ['HcpspecialitiesService'];

  function HcpspecialitiesListController(HcpspecialitiesService) {
    var vm = this;

    vm.hcpspecialities = HcpspecialitiesService.query();
  }
})();
