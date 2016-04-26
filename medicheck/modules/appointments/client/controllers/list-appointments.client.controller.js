(function () {
  'use strict';

  angular
    .module('appointments')
    .controller('AppointmentsListController', AppointmentsListController);

  AppointmentsListController.$inject = ['AppointmentsService'];

  function AppointmentsListController(AppointmentsService) {
    var vm = this;

    vm.appointments = AppointmentsService.query();
    console.log(vm.appointments);
  }
})();
