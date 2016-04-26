'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  HCP = mongoose.model('HCP');
 
 /**
 * Signup
 */
exports.create = function (req, res) {
  var hcp = new HCP(req.body); 
  hcp.user = req.user;

  hcp.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(hcp);
    }
  });
};
 
  
 /**
 * Show the current user-HCP
 */
exports.read = function (req, res) {
  res.json(req.model);
};

/**
 * List of Users-HCPs
 */
exports.list = function (req, res) {
  UserHCP.find({
      userID: req.userId
  }).exec(function (err, hcp) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(hcp);
  });
};
  

/**
 * Update user-HCP details
 */
exports.update = function (req, res) {
  // Init Variables
  var hcp = req.model;

  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  if (hcp) {
    // Merge existing hcp
    hcp = _.extend(hcp, req.body);
    hcp.updated = Date.now();

    hcp.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.login(hcp, function (err) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.json(hcp);
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Delete a user
 */
exports.delete = function (req, res) {
  var hcp = req.model;

  hcp.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(hcp);
  });
};

//Helpers functions

exports.userByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  // UserHCP.findById(id/*, '-salt -password'*/).exec(function (err, hcp) {
  //   if (err) {
  //     return next(err);
  //   } else if (!hcp) {
  //     return next(new Error('Failed to load user ' + id));
  //   }

  //   req.model = hcp;
  //   next();
  // });
};


/**
 * Update profile picture
 */
// exports.changeProfilePicture = function (req, res) {
//   var user = req.user;
//   var message = null;
//   var upload = multer(config.uploads.profileUpload).single('newProfilePicture');
//   var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;
  
//   // Filtering to upload only images
//   upload.fileFilter = profileUploadFileFilter;

//   if (user) {
//     upload(req, res, function (uploadError) {
//       if(uploadError) {
//         return res.status(400).send({
//           message: 'Error occurred while uploading profile picture'
//         });
//       } else {
//         user.profileImageURL = config.uploads.profileUpload.dest + req.file.filename;

//         user.save(function (saveError) {
//           if (saveError) {
//             return res.status(400).send({
//               message: errorHandler.getErrorMessage(saveError)
//             });
//           } else {
//             req.login(user, function (err) {
//               if (err) {
//                 res.status(400).send(err);
//               } else {
//                 res.json(user);
//               }
//             });
//           }
//         });
//       }
//     });
//   } else {
//     res.status(400).send({
//       message: 'User is not signed in'
//     });
//   }
// };

/**
 * Send User
 */
exports.me = function (req, res) {
  res.json(req.hcp || null);
};
