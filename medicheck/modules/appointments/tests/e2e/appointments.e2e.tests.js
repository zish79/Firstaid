'use strict';

describe('Appointments E2E Tests:', function () {
  describe('Test Appointments page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/appointments');
      expect(element.all(by.repeater('appointment in appointments')).count()).toEqual(0);
    });
  });
});
