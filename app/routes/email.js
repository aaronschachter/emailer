'use strict';

const express = require('express')
const router = express.Router();

const emailer = require('../../lib/email');
const emailValidator = require('email-validator');
const logger = require('winston');

/**
 * Sends a 422 error with given message for given response.
 *
 * @param {Object} res - Express response
 */
function sendUnprocessibleEntityError(res, message) {
  const status = 422;

  res.status(status).send({ status, message });
}

/**
 * Checks if given data object contains required parameters to post a message.
 *
 * @param {Object} data
 * @return {boolean}
 */
function missingEmailParams(data) {
  if (!data) {
    return true;
  }

  const requiredParams = ['to', 'to_name', 'from', 'from_name', 'subject', 'body'];

  return requiredParams.some(paramName => !data[paramName]);
}

/**
 * Validate incoming request parameters.
 */
router.use('/', (req, res, next) => {
  const body = req.body;
  let msg;

  if (missingEmailParams(body)) {
    return sendUnprocessibleEntityError(res, 'Missing required body parameters.');
  }
  if (!emailValidator.validate(body.to)) {
    return sendUnprocessibleEntityError(res, 'Invalid \'to\' email address.'); 
  }
  if (!emailValidator.validate(body.from)) {
    return sendUnprocessibleEntityError(res, 'Invalid \'from\' email address.'); 
  }

  next();
});

/**
 * Post incoming request parameters to our email provider to send them as an email.
 */
router.post('/', (req, res) => {
  let postEmail;
  if (process.env.EMAIL_PROVIDER === 'mandrill') {
    postEmail = emailer.postMandrillMessage(req.body);
  } else {
    postEmail = emailer.postMailgunMessage(req.body);
  }

  return postEmail
    .then((response) => {
      const jsonResponse = JSON.parse(response.text);
      logger.debug(jsonResponse);

      return res.status(response.status).send(jsonResponse);
    })
    .catch((err) => {
      logger.error(err);

      return res.status(500).send(err.message);
    });
});

module.exports = router;
