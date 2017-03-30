'use strict';

const agent = require('superagent');
const logger = require('winston');

/**
 * Returns object to send as payload to Mandrill Messages API.
 *
 * @param {Object} data
 * @return {Object}
 */
function formatPayload(data) {
  const payload = {
    key: process.env.MANDRILL_API_KEY,
    message: {
      text: data.body,
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
    }
  };
  if (data.html) {
    payload.message.html = data.html;
    payload.message.auto_text = true;
  }

  return payload;
}

/**
 * Posts given data object to Mandrill API to send a message.
 *
 * @param {Object} data
 * @return {Promise}
 */
module.exports.postMessage = function (data) {
  logger.debug(`mandrill.postMessage:${JSON.stringify(data)}`);

  return agent.post('https://mandrillapp.com/api/1.0/messages/send')
    .send(formatPayload(data))
    .set('Accept', 'application/json')
    .type('form');
};
