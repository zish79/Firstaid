'use strict';

(function () {
  describe('HCPController', function () {
    //Initialize global variables
    var scope,
      HCPController;

    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();

      HCPController = $controller('HCPController', {
        $scope: scope
      });
    }));

    it('should expose the authentication service', function () {
      expect(scope.authentication).toBeTruthy();
    });
  });
})();
