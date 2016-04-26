'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Patient Schema
 */
var patientSchema = new Schema({
   user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  preferredHcpGender: {
    type: [{
      type: String
    }],
    default: ''
  },
  weight: {
    type: String,
    trim: true,
    default: ''
  },
  height: {
    type: String,
    trim: true,
    default: ''
  },
  pencillinAllergy: {
    type: Boolean,
    default: ''
  },
  drugAllergies: {
    type: String,
    default: ''
  },
  allergies: {
    type: String,
    default: ''
  },
  renalDysfunction: {
    type: Boolean,
    default: ''
  },
  pastDiseases: {
    type: String,
    default: ''
  },
  currentDrugs: {
    type: String,
    default: ''
  },
  smoking: {
    type: String,
    default: ''
  },
  medicalInfo: {
    type: String,
    default: ''
  }
});

mongoose.model('Patient', patientSchema);
