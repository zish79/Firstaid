'use strict';

describe('Hcpspecialities E2E Tests:', function () {
  describe('Test Hcpspecialities page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/hcpspecialities');
      expect(element.all(by.repeater('hcpspeciality in hcpspecialities')).count()).toEqual(0);
    });
  });
});
