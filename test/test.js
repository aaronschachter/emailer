'use strict';

require('dotenv').config({ silent: true });
const assert = require('assert');

function getData() { 
  return {
    to: 'rick@walkingdead.com',
    to_name: 'Rick',
    from: 'neegan@walkingdead.com',
    from_name: 'Neegan',
    subject: 'Hello from the Saviors',
    body: '<h1>HI</h1><p>Want to chat?</p>',
    text: 'Hi want to chat?',
  };
};

const helpers = require('../lib/helpers');
describe('/lib/helpers', function() {
  describe('#missingEmailParams()', function() {
    const data = getData();

    it('should return false if not missing any parameters', function() {
      assert.equal(false, helpers.missingEmailParams(data));
    });

    // Text parameter isn't passed in our POST request.
    delete data.text;
    const params = Object.keys(data);

    params.forEach((param) => {
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

const mailgun = require('../lib/mailgun');
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
        text: data.text,
        html: data.html,
      };
      assert.deepEqual(formatted, mailgun.formatPayload(data));
    });
  });
});

const mandrill = require('../lib/mandrill');
describe('/lib/mandrill', function() {
  const data = getData();
  describe('#formatPayload()', function() {
    it('should return expected object', function() {
      const formatted = {
        key: process.env.MANDRILL_API_KEY,
        message: {
          text: data.text,
          html: data.html,
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