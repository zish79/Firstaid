(function () {
  'use strict';

  describe('Appointments List Controller Tests', function () {
    // Initialize global variables
    var AppointmentsListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      AppointmentsService,
      mockAppointment;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _AppointmentsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      AppointmentsService = _AppointmentsService_;

      // create mock article
      mockAppointment = new AppointmentsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Appointment Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Appointments List controller.
      AppointmentsListController = $controller('AppointmentsListController as vm', {
        $scope: $scope
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockAppointmentList;

      beforeEach(function () {
        mockAppointmentList = [mockAppointment, mockAppointment];
      });

      it('should send a GET request and return all Appointments', inject(function (AppointmentsService) {
        // Set POST response
        $httpBackend.expectGET('api/appointments').respond(mockAppointmentList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.appointments.length).toEqual(2);
        expect($scope.vm.appointments[0]).toEqual(mockAppointment);
        expect($scope.vm.appointments[1]).toEqual(mockAppointment);

      }));
    });
  });
})();
