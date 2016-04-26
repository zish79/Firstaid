'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Hcpspeciality = mongoose.model('Hcpspeciality'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, hcpspeciality;

/**
 * Hcpspeciality routes tests
 */
describe('Hcpspeciality CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Hcpspeciality
    user.save(function () {
      hcpspeciality = {
        name: 'Hcpspeciality name'
      };

      done();
    });
  });

  it('should be able to save a Hcpspeciality if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Hcpspeciality
        agent.post('/api/hcpspecialities')
          .send(hcpspeciality)
          .expect(200)
          .end(function (hcpspecialitySaveErr, hcpspecialitySaveRes) {
            // Handle Hcpspeciality save error
            if (hcpspecialitySaveErr) {
              return done(hcpspecialitySaveErr);
            }

            // Get a list of Hcpspecialities
            agent.get('/api/hcpspecialities')
              .end(function (hcpspecialitysGetErr, hcpspecialitysGetRes) {
                // Handle Hcpspeciality save error
                if (hcpspecialitysGetErr) {
                  return done(hcpspecialitysGetErr);
                }

                // Get Hcpspecialities list
                var hcpspecialities = hcpspecialitiesGetRes.body;

                // Set assertions
                (hcpspecialities[0].user._id).should.equal(userId);
                (hcpspecialities[0].name).should.match('Hcpspeciality name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Hcpspeciality if not logged in', function (done) {
    agent.post('/api/hcpspecialities')
      .send(hcpspeciality)
      .expect(403)
      .end(function (hcpspecialitySaveErr, hcpspecialitySaveRes) {
        // Call the assertion callback
        done(hcpspecialitySaveErr);
      });
  });

  it('should not be able to save an Hcpspeciality if no name is provided', function (done) {
    // Invalidate name field
    hcpspeciality.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Hcpspeciality
        agent.post('/api/hcpspecialities')
          .send(hcpspeciality)
          .expect(400)
          .end(function (hcpspecialitySaveErr, hcpspecialitySaveRes) {
            // Set message assertion
            (hcpspecialitySaveRes.body.message).should.match('Please fill Hcpspeciality name');

            // Handle Hcpspeciality save error
            done(hcpspecialitySaveErr);
          });
      });
  });

  it('should be able to update an Hcpspeciality if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Hcpspeciality
        agent.post('/api/hcpspecialities')
          .send(hcpspeciality)
          .expect(200)
          .end(function (hcpspecialitySaveErr, hcpspecialitySaveRes) {
            // Handle Hcpspeciality save error
            if (hcpspecialitySaveErr) {
              return done(hcpspecialitySaveErr);
            }

            // Update Hcpspeciality name
            hcpspeciality.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Hcpspeciality
            agent.put('/api/hcpspecialities/' + hcpspecialitySaveRes.body._id)
              .send(hcpspeciality)
              .expect(200)
              .end(function (hcpspecialityUpdateErr, hcpspecialityUpdateRes) {
                // Handle Hcpspeciality update error
                if (hcpspecialityUpdateErr) {
                  return done(hcpspecialityUpdateErr);
                }

                // Set assertions
                (hcpspecialityUpdateRes.body._id).should.equal(hcpspecialitySaveRes.body._id);
                (hcpspecialityUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Hcpspecialities if not signed in', function (done) {
    // Create new Hcpspeciality model instance
    var hcpspecialityObj = new Hcpspeciality(hcpspeciality);

    // Save the hcpspeciality
    hcpspecialityObj.save(function () {
      // Request Hcpspecialities
      request(app).get('/api/hcpspecialities')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Hcpspeciality if not signed in', function (done) {
    // Create new Hcpspeciality model instance
    var hcpspecialityObj = new Hcpspeciality(hcpspeciality);

    // Save the Hcpspeciality
    hcpspecialityObj.save(function () {
      request(app).get('/api/hcpspecialities/' + hcpspecialityObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', hcpspeciality.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Hcpspeciality with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/hcpspecialities/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Hcpspeciality is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Hcpspeciality which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Hcpspeciality
    request(app).get('/api/hcpspecialities/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Hcpspeciality with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Hcpspeciality if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Hcpspeciality
        agent.post('/api/hcpspecialities')
          .send(hcpspeciality)
          .expect(200)
          .end(function (hcpspecialitySaveErr, hcpspecialitySaveRes) {
            // Handle Hcpspeciality save error
            if (hcpspecialitySaveErr) {
              return done(hcpspecialitySaveErr);
            }

            // Delete an existing Hcpspeciality
            agent.delete('/api/hcpspecialities/' + hcpspecialitySaveRes.body._id)
              .send(hcpspeciality)
              .expect(200)
              .end(function (hcpspecialityDeleteErr, hcpspecialityDeleteRes) {
                // Handle hcpspeciality error error
                if (hcpspecialityDeleteErr) {
                  return done(hcpspecialityDeleteErr);
                }

                // Set assertions
                (hcpspecialityDeleteRes.body._id).should.equal(hcpspecialitySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Hcpspeciality if not signed in', function (done) {
    // Set Hcpspeciality user
    hcpspeciality.user = user;

    // Create new Hcpspeciality model instance
    var hcpspecialityObj = new Hcpspeciality(hcpspeciality);

    // Save the Hcpspeciality
    hcpspecialityObj.save(function () {
      // Try deleting Hcpspeciality
      request(app).delete('/api/hcpspecialities/' + hcpspecialityObj._id)
        .expect(403)
        .end(function (hcpspecialityDeleteErr, hcpspecialityDeleteRes) {
          // Set message assertion
          (hcpspecialityDeleteRes.body.message).should.match('User is not authorized');

          // Handle Hcpspeciality error error
          done(hcpspecialityDeleteErr);
        });

    });
  });

  it('should be able to get a single Hcpspeciality that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Hcpspeciality
          agent.post('/api/hcpspecialities')
            .send(hcpspeciality)
            .expect(200)
            .end(function (hcpspecialitySaveErr, hcpspecialitySaveRes) {
              // Handle Hcpspeciality save error
              if (hcpspecialitySaveErr) {
                return done(hcpspecialitySaveErr);
              }

              // Set assertions on new Hcpspeciality
              (hcpspecialitySaveRes.body.name).should.equal(hcpspeciality.name);
              should.exist(hcpspecialitySaveRes.body.user);
              should.equal(hcpspecialitySaveRes.body.user._id, orphanId);

              // force the Hcpspeciality to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Hcpspeciality
                    agent.get('/api/hcpspecialities/' + hcpspecialitySaveRes.body._id)
                      .expect(200)
                      .end(function (hcpspecialityInfoErr, hcpspecialityInfoRes) {
                        // Handle Hcpspeciality error
                        if (hcpspecialityInfoErr) {
                          return done(hcpspecialityInfoErr);
                        }

                        // Set assertions
                        (hcpspecialityInfoRes.body._id).should.equal(hcpspecialitySaveRes.body._id);
                        (hcpspecialityInfoRes.body.name).should.equal(hcpspeciality.name);
                        should.equal(hcpspecialityInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Hcpspeciality.remove().exec(done);
    });
  });
});
