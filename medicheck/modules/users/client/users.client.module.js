'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users', ['core']);
ApplicationConfiguration.registerModule('users.admin', ['core.admin']);
ApplicationConfiguration.registerModule('users.admin.routes', ['core.admin.routes']);


ApplicationConfiguration.registerModule('hcp.users', ['core']);
ApplicationConfiguration.registerModule('hcp.users.routes', ['core']);

ApplicationConfiguration.registerModule('patient.users', ['core']);
ApplicationConfiguration.registerModule('patient.users.routes', ['core']);

//ApplicationConfiguration.registerModule('App', ['ui.calendar']);