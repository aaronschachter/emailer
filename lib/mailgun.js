'use strict';

const agent = require('superagent');
const logger = require('winston');

/**
 * Posts given data object to Mailgun API to send a message.
 *
 * @param {Object} data
 * @return {Promise}
 */
module.exports.postMessage = function (data) {
  logger.debug(`mailgun.postMessage:${JSON.stringify(data)}`);

  const scope = data;
  if (data.body) {
    scope.text = data.body;
  }
  const uri = `https://api.mailgun.net/v3/${process.env.MAILGUN_API_BASEURI}/messages`;

  return agent.post(uri)
    .auth('api', process.env.MAILGUN_SECRET_API_KEY)
    .send(scope)
    .type('form');
};
