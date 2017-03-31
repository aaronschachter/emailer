'use strict';

require('dotenv').config({ silent: true });
const assert = require('assert');

/**
 * Example /POST email payload to use in tests.
 */
function getData() { 
  return {
    to: 'rick@walkingdead.com',
    to_name: 'Rick',
    from: 'neegan@walkingdead.com',
    from_name: 'Neegan',
    subject: 'Hello from the Saviors',
    body: '<h1>Hey Rick!</h1><p>Want to<a href="http://www.aim.com/">chat on AOL?</a></p>',
  };
};

/**
 * Helpers.
 */
const helpers = require('../lib/helpers');
describe('/lib/helpers', function() {
  describe('#missingEmailParams()', function() {
    const data = getData();

    it('should return false if not missing any parameters', function() {
      assert.equal(false, helpers.missingEmailParams(data));
    });

    // For each property in our data object, verify missingEmailParams if the property is missing.
    Object.keys(data).forEach((param) => {
      const scope = getData();
      delete scope[param];

      it(`should return true if missing parameter ${param}`, function() {
        assert.equal(true, helpers.missingEmailParams(scope));
      });
    });

    it('should return true if empty', function() {
      assert.equal(true, helpers.missingEmailParams({}));
    });
  });
});

/**
 * Mailgun.
 */
const mailgun = require('../lib/mailgun');
const htmlToText = require('html-to-text');
describe('/lib/mailgun', function() {
  const data = getData();

  describe('#formatEmailString()', function() {
    it('should return expected string', function() {
      assert.equal(`${data.to_name} <${data.to}>`, mailgun.formatEmailString(data.to, data.to_name));
    });
  });

  describe('#formatPayload()', function() {
    it('should return expected object', function() {
      const formatted = {
        to: mailgun.formatEmailString(data.to, data.to_name),
        from: mailgun.formatEmailString(data.from, data.from_name),
        subject: data.subject,
        text: htmlToText.fromString(data.body),
        html: data.body,
      };
      assert.deepEqual(formatted, mailgun.formatPayload(data));
    });
  });
});

/**
 * Mandrill.
 */
const mandrill = require('../lib/mandrill');
describe('/lib/mandrill', function() {
  const data = getData();

  describe('#formatPayload()', function() {
    it('should return expected object', function() {
      const formatted = {
        key: process.env.MANDRILL_API_KEY,
        message: {
          auto_text: true,
          html: data.body,
          subject: data.subject,
          from_email: data.from,
          from_name: data.from_name,
          to: [
            {
              email: data.to,
              name: data.to_name,
              type: 'to',
            }
          ],
        },
      };
      assert.deepEqual(formatted, mandrill.formatPayload(data));
    });
  });
});