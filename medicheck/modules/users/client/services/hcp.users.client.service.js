'use strict';

// // Users service used for communicating with the users REST endpoint
// angular.module('users').factory('Users', ['$resource',
//   function ($resource) {
//     return $resource('api/users/hcp', {}, {
//       update: {
//         method: 'PUT'
//       }
//     });
//   }
// ]);

//TODO this should be Users service
angular.module('hcp.users').factory('HCP', ['$resource',
  function ($resource) {
    return $resource('api/hcp/:userId', {
      hcpId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
  }
]);
