'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Hcpspeciality = mongoose.model('Hcpspeciality'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Hcpspeciality
 */
exports.create = function(req, res) {
  var hcpspeciality = new Hcpspeciality(req.body);
  hcpspeciality.user = req.user;

  hcpspeciality.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(hcpspeciality);
    }
  });
};

/**
 * Show the current Hcpspeciality
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var hcpspeciality = req.hcpspeciality ? req.hcpspeciality.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  hcpspeciality.isCurrentUserOwner = req.user && hcpspeciality.user && hcpspeciality.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(hcpspeciality);
};

/**
 * Update a Hcpspeciality
 */
exports.update = function(req, res) {
  var hcpspeciality = req.hcpspeciality ;

  hcpspeciality = _.extend(hcpspeciality , req.body);

  hcpspeciality.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(hcpspeciality);
    }
  });
};

/**
 * Delete an Hcpspeciality
 */
exports.delete = function(req, res) {
  var hcpspeciality = req.hcpspeciality ;

  hcpspeciality.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(hcpspeciality);
    }
  });
};

/**
 * List of Hcpspecialities
 */
exports.list = function(req, res) { 
  Hcpspeciality.find().sort('-created').populate('speciality', 'specialityName').exec(function(err, hcpspecialities) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(hcpspecialities);
    }
  });
};

/**
 * Dynamic lookup Hcpspecialities 
 */
exports.dynamicLookupWithSpeciality = function(req, res) { 
  Hcpspeciality.find({specialityName: req.body.name/*can be changed*/}).sort('-created').populate('speciality', 'specialityName').exec(function(err, hcpspecialities) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(hcpspecialities);
    }
  });
};


/**
 * Hcpspeciality middleware
 */
exports.hcpspecialityByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Hcpspeciality is invalid'
    });
  }

  Hcpspeciality.findById(id).populate('speciality', 'specialityName').exec(function (err, hcpspeciality) {
    if (err) {
      return next(err);
    } else if (!hcpspeciality) {
      return res.status(404).send({
        message: 'No Hcpspeciality with that identifier has been found'
      });
    }
    req.hcpspeciality = hcpspeciality;
    next();
  });
};
