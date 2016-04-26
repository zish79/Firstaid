'use strict';

/**
 * Module dependencies
 */
var appointmentsPolicy = require('../policies/appointments.server.policy'),
  appointments = require('../controllers/appointments.server.controller');

module.exports = function(app) {
  // Appointments Routes
  app.route('/api/appointments').all(appointmentsPolicy.isAllowed)
    .get(appointments.list)
    .post(appointments.create);
    
    app.route('/api/todaysBookedAppointments').all(appointmentsPolicy.isAllowed)
    .get(appointments.todaysBookedAppointments);

    app.route('/api/patientUpcomingAppointments').all(appointmentsPolicy.isAllowed)
    .get(appointments.patientUpcomingAppointments);
    
    app.route('/api/dropInWaitingRoom').all(appointmentsPolicy.isAllowed)
    .get(appointments.dropInWaitingRoom);

  app.route('/api/appointments/:appointmentId').all(appointmentsPolicy.isAllowed)
    .get(appointments.read)
    .put(appointments.update)
    .delete(appointments.delete);

  // Finish by binding the Appointment middleware
  app.param('appointmentId', appointments.appointmentByID);
};

