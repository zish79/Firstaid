'use strict';

/**
 * Module dependencies.
 */
var patientsPolicy = require('../policies/patients.server.policy'),
    patients = require('../controllers/patients.server.controller');

module.exports = function(app) {
    // Patients collection routes
    app.route('/api/patients').all(patientsPolicy.isAllowed)
        .get(patients.list)
        .post(patients.create);

    app.route('/api/userpatient').all(patientsPolicy.isAllowed)
        .get(patients.getUserPatient);

    // Single patient routes
    app.route('/api/patients/:patientId').all(patientsPolicy.isAllowed)
        .get(patients.read)
        .put(patients.update)
        .delete(patients.delete);

    //   app.route('/api/getAppointment1/:appointmentId').all(patientsPolicy.isAllowed)
    //     .get(patients.todaysBookedAppointments);

    // Finish by binding the patient middleware
    app.param('patientId', patients.patientByID);
};