'use strict';

const agent = require('superagent');
const logger = require('winston');
const Promise = require('bluebird');

/**
 * Returns string to pass as an email in Mailgun Messages API.
 *
 * @param {string} email
 * @param {string} name
 * @return {string}
 */
module.exports.formatEmailString = function (email, name) {
  return `${name} <${email}>`;
}

/**
 * Returns object to send as payload to Mailgun Messages API.
 *
 * @param {Object} data
 * @return {Object}
 */
module.exports.formatPayload = function (data) {
  return {
    to: this.formatEmailString(data.to, data.to_name),
    from: this.formatEmailString(data.from, data.from_name),
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
  logger.debug(data);

  return new Promise((resolve, reject) => {
    return agent.post(`https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`)
      .auth('api', process.env.MAILGUN_API_KEY)
      .set('Accept', 'application/json')
      .type('form')
      .send(this.formatPayload(data))
      .then(response => resolve(response.body))
      .catch(err => reject(err));
  });
};
