'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Appointment Schema
 */
var AppointmentSchema = new Schema({
  appointmentDescription: {
    type: String,
    default: '',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date,
    default: Date.now
  },
  HCPNotes: {
    type: String,
    default: '',
    trim: true
  },
  appointmentStatus: {
    type: String,
    default: '',
    trim: true
  },
  user: {                   //The currently logged in user, can be HCP or Patient
    type: Schema.ObjectId,
    ref: 'User'
  },
  appointeduser: {          //The appointedUser aginst the logged in user 
    type: Schema.ObjectId,  //For HCP its the Patient(s), for Patient its the HCP(s)
    ref: 'User'
  }
});

mongoose.model('Appointment', AppointmentSchema);
