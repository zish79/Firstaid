'use strict';

/**
 * Module dependencies
 */
var hcpspecialitiesPolicy = require('../policies/hcpspecialities.server.policy'),
  hcpspecialities = require('../controllers/hcpspecialities.server.controller');

module.exports = function(app) {
  // Hcpspecialities Routes
  app.route('/api/hcpspecialities').all(hcpspecialitiesPolicy.isAllowed)
    .get(hcpspecialities.list)
    .post(hcpspecialities.create);
    
  app.route('/api/hcpspecialities/dynamicSpeciality').all(hcpspecialitiesPolicy.isAllowed)
    .post(hcpspecialities.dynamicLookupWithSpeciality);

  app.route('/api/hcpspecialities/:hcpspecialityId').all(hcpspecialitiesPolicy.isAllowed)
    .get(hcpspecialities.read)
    .put(hcpspecialities.update)
    .delete(hcpspecialities.delete);

  // Finish by binding the Hcpspeciality middleware
  app.param('hcpspecialityId', hcpspecialities.hcpspecialityByID);
};
