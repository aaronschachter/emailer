'use strict';

const logger = require('winston');

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
}
