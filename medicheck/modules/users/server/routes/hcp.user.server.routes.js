'use strict';

module.exports = function (app) {
  // User Routes
  var hcp = require('../controllers/hcp.user.server.controller');

  // Setting up the users profile api
  app.route('/api/users/hcp/me').get(hcp.me);
  //app.route('/api/users/hcp').put(users.update);
  //app.route('/api/users/hcp/accounts').delete(users.removeOAuthProvider);
  //app.route('/api/users/hcp/password').post(users.changePassword);
  //app.route('/api/users/hcp/picture').post(users.changeProfilePicture);
  
  app.route('/api/hcp')
        .get(hcp.list)
        .post(hcp.create);
  
  // Single user routes
  app.route('/api/users/hcp/:userId')
    .get(hcp.read)
    .put(hcp.update)
    .delete(hcp.delete);

  // Finish by binding the user middleware
  app.param('userId', hcp.userByID);
};
