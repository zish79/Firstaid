(function () {
  'use strict';

  // Appointments controller
  angular
    .module('appointments')
    .controller('AppointmentsController', AppointmentsController);

  AppointmentsController.$inject = ['$scope', '$state', 'Authentication', 'appointmentResolve'];

  function AppointmentsController ($scope, $state, Authentication, appointment) {
    var vm = this;

    vm.authentication = Authentication;
    vm.appointment = appointment;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Appointment
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.appointment.$remove($state.go('appointments.list'));
      }
    }

    // Save Appointment
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.appointmentForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.appointment._id) {
        vm.appointment.$update(successCallback, errorCallback);
      } else {
        vm.appointment.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('appointments.view', {
          appointmentId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
