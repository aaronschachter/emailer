'use strict';

const agent = require('superagent');
const logger = require('winston');
const Promise = require('bluebird');

/**
 * Returns object to send as payload to Mandrill Messages API.
 *
 * @param {Object} data
 * @return {Object}
 */
module.exports.formatPayload = function (data) {
  const payload = {
    key: process.env.MANDRILL_API_KEY,
    message: {
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
      auto_text: true,
    }
  };

  return payload;
}

/**
 * Posts given data object to Mandrill API to send a message.
 *
 * @param {Object} data
 * @return {Promise}
 */
module.exports.postMessage = function (data) {
  logger.debug(data);

  return new Promise((resolve, reject) => {
    return agent.post('https://mandrillapp.com/api/1.0/messages/send')
      .send(this.formatPayload(data))
      .then((response) => {
        const recipient = response.body[0];
        if (recipient.status === 'rejected' || recipient.status === 'invalid') {
          const err = new Error('Unsuccessful request.');
          err.providerResponse = recipient;

          return reject(err);
        }

        return resolve(recipient);
      })
      .catch(err => reject(err));
  });
};
