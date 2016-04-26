'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Appointments Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/appointments',
      permissions: '*'
    }, {
      resources: '/api/appointments/:appointmentId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/appointments',
      permissions: ['get', 'post']
    }, {
      resources: '/api/appointments/:appointmentId',
      permissions: ['get']
    },
    {
      resources: '/api/todaysBookedAppointments',
      permissions: ['get']
    },
    {
      resources: '/api/patientUpcomingAppointments',
      permissions: ['get']
    },
    {
      resources: '/api/dropInWaitingRoom',
      permissions: ['get']
    }
    ]
  }, 
   {
    roles: ['guest'],
    allows: [{
      resources: '/api/appointments',
      permissions: ['get']
    }, {
      resources: '/api/appointments/:appointmentId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Appointments Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Appointment is being processed and the current user created it then allow any manipulation
  if (req.appointment && req.user && req.appointment.user && req.appointment.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};

