'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Hcpspeciality Schema
 */
var HcpspecialitySchema = new Schema({
  HCPId: {
    type: Schema.ObjectId,
    ref: 'HCP'
  },
  
  specialityName: {
    type: String,
    trim: true,
    default: '',
    //validate: [validateLocalStrategyProperty, 'Please fill in your first name']
  },
  
  specialityDescription: {
    type: String,
    trim: true,
    default: '',
    //validate: [validateLocalStrategyProperty, 'Please fill in your last name']
  },
  created: {
    type: Date,
    default: Date.now
  },
  // user: {
  //   type: Schema.ObjectId,
  //   ref: 'User'
  // }
});

mongoose.model('Hcpspeciality', HcpspecialitySchema);
