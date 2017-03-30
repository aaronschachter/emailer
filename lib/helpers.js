'use strict';

const agent = require('superagent');
const isHtml = require('is-html');
const logger = require('winston');

/**
 * Posts given data object to Mailgun to send a message.
 *
 * @param {Object} data
 * @return {Promise}
 */
module.exports.postMailgunMessage = function (data) {
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

/**
 * Returns object to send as payload to Mandrill Send Message API.
 *
 * @param {Object} data
 * @return {Object}
 */
function getMandrillPayload(data) {
  const payload = {
    key: process.env.MANDRILL_API_KEY,
    message: {
      text: data.body,
      subject: data.subject,
      from_email: data.from,
      to: [
        { email: data.to }
      ],
    }
  };
  if (data.html) {
    payload.message.html = data.html;
  }

  return payload;
}

/**
 * Posts given data object to Mandrill to send a message.
 *
 * @param {Object} data
 * @return {Promise}
 */
module.exports.postMandrillMessage = function (data) {
  logger.debug(`postMandrillMessage:${JSON.stringify(data)}`);

  return agent.post('https://mandrillapp.com/api/1.0/messages/send')
    .send(getMandrillPayload(data))
    .set('Accept', 'application/json')
    .type('form');
}

/**
 * Sends a 422 error with given message for given response.
 *
 * @param {Object} res - Express response
 * @param {string} message
 */
function sendUnprocessibleEntityError(res, message) {
  const status = 422;

  res.status(status).send({ status, message });
}
