'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Hcpspecialities Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/hcpspecialities',
      permissions: '*'
    }, {
      resources: '/api/hcpspecialities/:hcpspecialityId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/hcpspecialities',
      permissions: ['get', 'post']
    }, {
      resources: '/api/hcpspecialities/:hcpspecialityId',
      permissions: ['get']
    },
    {
      resources: '/api/hcpspecialities/dynamicSpeciality',
      permissions: ['post']
    }
    ]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/hcpspecialities',
      permissions: ['get']
    }, {
      resources: '/api/hcpspecialities/:hcpspecialityId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Hcpspecialities Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Hcpspeciality is being processed and the current user created it then allow any manipulation
  if (req.hcpspeciality && req.user && req.hcpspeciality.user && req.hcpspeciality.user.id === req.user.id) {
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
