'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Appointment = mongoose.model('Appointment'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, appointment;

/**
 * Appointment routes tests
 */
describe('Appointment CRUD tests', function () {

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

    // Save a user to the test db and create new Appointment
    user.save(function () {
      appointment = {
        name: 'Appointment name'
      };

      done();
    });
  });

  it('should be able to save a Appointment if logged in', function (done) {
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

        // Save a new Appointment
        agent.post('/api/appointments')
          .send(appointment)
          .expect(200)
          .end(function (appointmentSaveErr, appointmentSaveRes) {
            // Handle Appointment save error
            if (appointmentSaveErr) {
              return done(appointmentSaveErr);
            }

            // Get a list of Appointments
            agent.get('/api/appointments')
              .end(function (appointmentsGetErr, appointmentsGetRes) {
                // Handle Appointment save error
                if (appointmentsGetErr) {
                  return done(appointmentsGetErr);
                }

                // Get Appointments list
                var appointments = appointmentsGetRes.body;

                // Set assertions
                (appointments[0].user._id).should.equal(userId);
                (appointments[0].name).should.match('Appointment name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Appointment if not logged in', function (done) {
    agent.post('/api/appointments')
      .send(appointment)
      .expect(403)
      .end(function (appointmentSaveErr, appointmentSaveRes) {
        // Call the assertion callback
        done(appointmentSaveErr);
      });
  });

  it('should not be able to save an Appointment if no name is provided', function (done) {
    // Invalidate name field
    appointment.name = '';

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

        // Save a new Appointment
        agent.post('/api/appointments')
          .send(appointment)
          .expect(400)
          .end(function (appointmentSaveErr, appointmentSaveRes) {
            // Set message assertion
            (appointmentSaveRes.body.message).should.match('Please fill Appointment name');

            // Handle Appointment save error
            done(appointmentSaveErr);
          });
      });
  });

  it('should be able to update an Appointment if signed in', function (done) {
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

        // Save a new Appointment
        agent.post('/api/appointments')
          .send(appointment)
          .expect(200)
          .end(function (appointmentSaveErr, appointmentSaveRes) {
            // Handle Appointment save error
            if (appointmentSaveErr) {
              return done(appointmentSaveErr);
            }

            // Update Appointment name
            appointment.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Appointment
            agent.put('/api/appointments/' + appointmentSaveRes.body._id)
              .send(appointment)
              .expect(200)
              .end(function (appointmentUpdateErr, appointmentUpdateRes) {
                // Handle Appointment update error
                if (appointmentUpdateErr) {
                  return done(appointmentUpdateErr);
                }

                // Set assertions
                (appointmentUpdateRes.body._id).should.equal(appointmentSaveRes.body._id);
                (appointmentUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Appointments if not signed in', function (done) {
    // Create new Appointment model instance
    var appointmentObj = new Appointment(appointment);

    // Save the appointment
    appointmentObj.save(function () {
      // Request Appointments
      request(app).get('/api/appointments')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Appointment if not signed in', function (done) {
    // Create new Appointment model instance
    var appointmentObj = new Appointment(appointment);

    // Save the Appointment
    appointmentObj.save(function () {
      request(app).get('/api/appointments/' + appointmentObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', appointment.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Appointment with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/appointments/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Appointment is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Appointment which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Appointment
    request(app).get('/api/appointments/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Appointment with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Appointment if signed in', function (done) {
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

        // Save a new Appointment
        agent.post('/api/appointments')
          .send(appointment)
          .expect(200)
          .end(function (appointmentSaveErr, appointmentSaveRes) {
            // Handle Appointment save error
            if (appointmentSaveErr) {
              return done(appointmentSaveErr);
            }

            // Delete an existing Appointment
            agent.delete('/api/appointments/' + appointmentSaveRes.body._id)
              .send(appointment)
              .expect(200)
              .end(function (appointmentDeleteErr, appointmentDeleteRes) {
                // Handle appointment error error
                if (appointmentDeleteErr) {
                  return done(appointmentDeleteErr);
                }

                // Set assertions
                (appointmentDeleteRes.body._id).should.equal(appointmentSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Appointment if not signed in', function (done) {
    // Set Appointment user
    appointment.user = user;

    // Create new Appointment model instance
    var appointmentObj = new Appointment(appointment);

    // Save the Appointment
    appointmentObj.save(function () {
      // Try deleting Appointment
      request(app).delete('/api/appointments/' + appointmentObj._id)
        .expect(403)
        .end(function (appointmentDeleteErr, appointmentDeleteRes) {
          // Set message assertion
          (appointmentDeleteRes.body.message).should.match('User is not authorized');

          // Handle Appointment error error
          done(appointmentDeleteErr);
        });

    });
  });

  it('should be able to get a single Appointment that has an orphaned user reference', function (done) {
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

          // Save a new Appointment
          agent.post('/api/appointments')
            .send(appointment)
            .expect(200)
            .end(function (appointmentSaveErr, appointmentSaveRes) {
              // Handle Appointment save error
              if (appointmentSaveErr) {
                return done(appointmentSaveErr);
              }

              // Set assertions on new Appointment
              (appointmentSaveRes.body.name).should.equal(appointment.name);
              should.exist(appointmentSaveRes.body.user);
              should.equal(appointmentSaveRes.body.user._id, orphanId);

              // force the Appointment to have an orphaned user reference
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

                    // Get the Appointment
                    agent.get('/api/appointments/' + appointmentSaveRes.body._id)
                      .expect(200)
                      .end(function (appointmentInfoErr, appointmentInfoRes) {
                        // Handle Appointment error
                        if (appointmentInfoErr) {
                          return done(appointmentInfoErr);
                        }

                        // Set assertions
                        (appointmentInfoRes.body._id).should.equal(appointmentSaveRes.body._id);
                        (appointmentInfoRes.body.name).should.equal(appointment.name);
                        should.equal(appointmentInfoRes.body.user, undefined);

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
      Appointment.remove().exec(done);
    });
  });
});
