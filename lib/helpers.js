'use strict';

const logger = require('winston');

/**
 * Checks if given data object contains required parameters to post a message.
 *
 * @param {Object} data
 * @return {boolean}
 */
module.exports.missingEmailParams = function (data) {
  if (!data) {
    return true;
  }

  const requiredParams = ['to', 'to_name', 'from', 'from_name', 'subject', 'body'];

  return requiredParams.some(paramName => !data[paramName]);
}

/**
 * Sends a 422 error with given message for given response.
 *
 * @param {Object} res - Express response
 * @param {string} message
 */
module.exports.sendUnprocessibleEntityError = function (res, message) {
  const status = 422;
  logger.warn({ status, message });

  res.status(status).send({ message });
};
