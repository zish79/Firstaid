(function () {
  'use strict';

  describe('Appointments Route Tests', function () {
    // Initialize global variables
    var $scope,
      AppointmentsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AppointmentsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AppointmentsService = _AppointmentsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('appointments');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/appointments');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          AppointmentsController,
          mockAppointment;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('appointments.view');
          $templateCache.put('modules/appointments/client/views/view-appointment.client.view.html', '');

          // create mock Appointment
          mockAppointment = new AppointmentsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Appointment Name'
          });

          //Initialize Controller
          AppointmentsController = $controller('AppointmentsController as vm', {
            $scope: $scope,
            appointmentResolve: mockAppointment
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:appointmentId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.appointmentResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            appointmentId: 1
          })).toEqual('/appointments/1');
        }));

        it('should attach an Appointment to the controller scope', function () {
          expect($scope.vm.appointment._id).toBe(mockAppointment._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/appointments/client/views/view-appointment.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AppointmentsController,
          mockAppointment;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('appointments.create');
          $templateCache.put('modules/appointments/client/views/form-appointment.client.view.html', '');

          // create mock Appointment
          mockAppointment = new AppointmentsService();

          //Initialize Controller
          AppointmentsController = $controller('AppointmentsController as vm', {
            $scope: $scope,
            appointmentResolve: mockAppointment
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.appointmentResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/appointments/create');
        }));

        it('should attach an Appointment to the controller scope', function () {
          expect($scope.vm.appointment._id).toBe(mockAppointment._id);
          expect($scope.vm.appointment._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/appointments/client/views/form-appointment.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AppointmentsController,
          mockAppointment;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('appointments.edit');
          $templateCache.put('modules/appointments/client/views/form-appointment.client.view.html', '');

          // create mock Appointment
          mockAppointment = new AppointmentsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Appointment Name'
          });

          //Initialize Controller
          AppointmentsController = $controller('AppointmentsController as vm', {
            $scope: $scope,
            appointmentResolve: mockAppointment
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:appointmentId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.appointmentResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            appointmentId: 1
          })).toEqual('/appointments/1/edit');
        }));

        it('should attach an Appointment to the controller scope', function () {
          expect($scope.vm.appointment._id).toBe(mockAppointment._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/appointments/client/views/form-appointment.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
