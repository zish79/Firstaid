'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.css',
        //'public/lib/bootstrap/dist/css/bootstrap-theme.css',
        'public/lib/font-awesome/css/font-awesome.min.css',
        //'public/lib/Materialize/dist/css/materialize.min.css'
        'public/lib/fullcalendar/dist/fullcalendar.min.css',
        'public/lib/ng-dialog/css/ngDialog.css',
        'public/lib/ng-dialog/css/ngDialog-theme-default.css'
        //'public/lib/fullcalendar/dist/fullcalendar.print.css'
      ],
      js: [
        'public/lib/angular/angular.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-ui-utils/ui-utils.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/jquery/dist/jquery.min.js',
        'public/lib/bootstrap/dist/js/bootstrap.min.js',
        'public/lib/angular-file-upload/angular-file-upload.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/Materialize/dist/js/materialize.min.js',
        'public/lib/moment/moment.js',
        'public/lib/angular-moment/angular-moment.min.js',
        'public/lib/angular-timer/dist//assets/js/angular-timer-all.min.js',
        'public/lib/angular-timer/dist/assets/js/angular-timer-bower.js',
        'public/lib/humanize-duration/humanize-duration.js',
        'public/lib/angular-ui-calendar/src/calendar.js',
        'public/lib/fullcalendar/dist/fullcalendar.min.js',
        'public/lib/fullcalendar/dist/gcal.js',
        'public/lib/ng-dialog/js/ngDialog.js',
      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/client/css/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js'
    ],
    views: ['modules/*/client/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gruntConfig: 'gruntfile.js',
    gulpConfig: 'gulpfile.js',
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: 'modules/*/server/config/*.js',
    policies: 'modules/*/server/policies/*.js',
    views: 'modules/*/server/views/*.html'
  }
};
