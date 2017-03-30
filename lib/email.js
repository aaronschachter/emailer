'use strict';

const agent = require('superagent');
const logger = require('winston');

module.exports.mailgun = function (data) {
  const scope = data;
  if (data.body) {
    scope.text = data.body;
  }
  const uri = `https://api.mailgun.net/v3/${process.env.MAILGUN_API_BASEURI}/messages`;

  return agent.post(uri)
    .auth('api', process.env.MAILGUN_SECRET_API_KEY)
    .send(scope)
    .type('form');
}

module.exports.mandrill = function (data) {
  const payload = {
    key: process.env.MANDRILL_API_KEY,
    message: {
      text: data.body,
      subject: data.subject,
      from_email: data.from,
      to: [{ email: data.to }],
    }
  };

  return agent.post('https://mandrillapp.com/api/1.0/messages/send')
    .send(payload)
    .set('Accept', 'application/json')
    .type('form');
}
