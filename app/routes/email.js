'use strict';

const express = require('express');
const router = express.Router();

const logger = require('winston');
const emailValidator = require('email-validator');
const helpers = require('../../lib/helpers');
const mailgun = require('../../lib/mailgun');
const mandrill = require('../../lib/mandrill');

/**
 * Validate incoming request parameters.
 */
router.use('/', (req, res, next) => {
  const body = req.body;
  logger.info('POST /email');
  logger.debug(body);

  if (helpers.missingEmailParams(body)) {
    return helpers.sendUnprocessibleEntityError(res, 'Missing required body parameters.');
  }
  if (!emailValidator.validate(body.to)) {
    return helpers.sendUnprocessibleEntityError(res, 'Invalid \'to\' email address.'); 
  }
  if (!emailValidator.validate(body.from)) {
    return helpers.sendUnprocessibleEntityError(res, 'Invalid \'from\' email address.'); 
  }

  next();
});

/**
 * Post req.body to our email provider to send message.
 */
router.post('/', (req, res) => {
  const data = req.body;

  let postMessage;
  let provider = 'mailgun';

  if (process.env.EMAIL_PROVIDER === 'mandrill') {
    provider = process.env.EMAIL_PROVIDER;
    postMessage = mandrill.postMessage(data);
  } else {
    postMessage = mailgun.postMessage(data);
  }

  return postMessage
    .then((postResponse) => {
      const response = {
        provider,
        message: `Success!`,
        provider_response: postResponse,
      };
      logger.info(response);

      return res.status(200).send(response);
    })
    .catch((err) => {
      const response = {
        provider,
        message: err.message,
        provider_response: err.providerResponse,
      };
      logger.error(response);

      return res.status(500).send(response);
    });
});

module.exports = router;
