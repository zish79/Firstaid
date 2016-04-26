(function () {
  'use strict';

  // Hcpspecialities controller
  angular
    .module('hcpspecialities')
    .controller('HcpspecialitiesController', HcpspecialitiesController);

  HcpspecialitiesController.$inject = ['$scope', '$state', 'Authentication', 'hcpspecialityResolve'];

  function HcpspecialitiesController ($scope, $state, Authentication, hcpspeciality) {
    var vm = this;

    vm.authentication = Authentication;
    vm.hcpspeciality = hcpspeciality;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Hcpspeciality
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.hcpspeciality.$remove($state.go('hcpspecialities.list'));
      }
    }

    // Save Hcpspeciality
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.hcpspecialityForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.hcpspeciality._id) {
        vm.hcpspeciality.$update(successCallback, errorCallback);
      } else {
        vm.hcpspeciality.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('hcpspecialities.view', {
          hcpspecialityId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
