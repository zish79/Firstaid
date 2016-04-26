'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  moment = require('moment'),
  Appointment = mongoose.model('Appointment'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Appointment
 */
exports.create = function(req, res) {
  var appointment = new Appointment(req.body);
  appointment.user = req.user;

  appointment.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(appointment);
    }
  });
};

/**
 * Show the current Appointment
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var appointment = req.appointment ? req.appointment.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  appointment.isCurrentUserOwner = req.user && appointment.user && appointment.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(appointment);
};

/**
 * Update a Appointment
 */
exports.update = function(req, res) {
  var appointment = req.appointment ;

  appointment = _.extend(appointment , req.body);

  appointment.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(appointment);
    }
  });
};

/**
 * Delete an Appointment
 */
exports.delete = function(req, res) {
  var appointment = req.appointment ;

  appointment.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(appointment);
    }
  });
};

/**
 * List of Appointments
 * http://stackoverflow.com/questions/14363065/mongoose-mongodb-query-joins-but-i-come-from-a-sql-background
 */
exports.list = function(req, res) { 
  Appointment.find().sort('-created').populate('user').populate('appointeduser').exec(function(err, appointments) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(appointments);
    }
  });
};

//Methods for HCP
//Getting booked appointments for the HCP
exports.todaysBookedAppointments = function(req, res) { 
    var today = moment().startOf('day');
    var tomorrow = moment(today).add(1, 'days');
    Appointment.find({'user' :  req.user._id, startTime : {$gte: today.toDate(), $lt: tomorrow.toDate()}}).sort('-created').populate('user').populate('appointeduser').exec(function(err, appointments) {
 //   Appointment.find({user :  req.params.userId }).sort('-created').populate('user').populate('appointeduser').exec(function(err, appointments) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(appointments);
    }
  });
};
//Getting Waiting Room appointments for the HCP
exports.dropInWaitingRoom = function(req, res) { 
    var today = moment().startOf('day');
    var tomorrow = moment(today).add(1, 'days');
    Appointment.find({'user' :  req.user._id , startTime : null , created : {$gte: today.toDate(), $lt: tomorrow.toDate()}}).sort('-created').populate('user').populate('appointeduser').exec(function(err, appointments) {
//    Appointment.find({user :  req.params.userId , startTime : null}).sort('-created').populate('user').populate('appointeduser').exec(function(err, appointments) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(appointments);
    }
  });
};

//Getting the Upcoming appointments for the patient
exports.patientUpcomingAppointments = function(req, res) { 
    var today = moment().startOf('time');
    var month = moment(today).add(1, 'month');
    Appointment.find({'user' :  req.user._id, startTime : {$gte: today.toDate(), $lt: month.toDate()}}).sort('-created').populate('user').populate('appointeduser').exec(function(err, appointments) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(appointments);
    }
  });
};



/**
 * Appointment middleware
 */
exports.appointmentByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Appointment is invalid'
    });
  }

  Appointment.findById(id).populate('user', 'displayName').exec(function (err, appointment) {
    if (err) {
      return next(err);
    } else if (!appointment) {
      return res.status(404).send({
        message: 'No Appointment with that identifier has been found'
      });
    }
    req.appointment = appointment;
    next();
  });
};




