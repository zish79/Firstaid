'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core',['appointments']);
ApplicationConfiguration.registerModule('patient',['appointments']);
ApplicationConfiguration.registerModule('appointmentBooking');
ApplicationConfiguration.registerModule('core.admin', ['core']);
ApplicationConfiguration.registerModule('core.admin.routes', ['ui.router']);

ApplicationConfiguration.registerModule('core', ['ui.calendar', 'ui.bootstrap', 'ngDialog']);