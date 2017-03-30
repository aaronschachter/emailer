'use strict';

const agent = require('superagent');
const logger = require('winston');

/**
 * Returns string to pass as an email in Mailgun Messages API.
 *
 * @param {string} email
 * @param {string} name
 * @return {string}
 */
function formatEmailString(email, name) {
  return `${name} <${email}>`;
}

/**
 * Returns object to send as payload to Mailgun Messages API.
 *
 * @param {Object} data
 * @return {Object}
 */
function formatPayload(data) {
  return {
    to: formatEmailString(data.to, data.to_name),
    from: formatEmailString(data.from, data.from_name),
    subject: data.subject,
    text: data.text,
    html: data.html,
  };
}

/**
 * Posts given data object to Mailgun API to send a message.
 *
 * @param {Object} data
 * @return {Promise}
 */
module.exports.postMessage = function (data) {
  logger.debug(`mailgun.postMessage:${JSON.stringify(data)}`);

  return agent.post(`https://api.mailgun.net/v3/${process.env.MAILGUN_API_BASEURI}/messages`)
    .auth('api', process.env.MAILGUN_SECRET_API_KEY)
    .set('Accept', 'application/json')
    .send(formatPayload(data))
    .type('form');
};
