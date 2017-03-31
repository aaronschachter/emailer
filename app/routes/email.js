'use strict';

const express = require('express');
const router = express.Router();

const emailValidator = require('email-validator');
const isHtml = require('is-html');
const logger = require('winston');
const striptags = require('striptags');

const helpers = require('../../lib/helpers');
const mailgun = require('../../lib/mailgun');
const mandrill = require('../../lib/mandrill');

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
  logger.info('POST /email');
  logger.debug(body);

  if (missingEmailParams(body)) {
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
 * Store req.body.text and req.body.html properties from req.body.body param.
 */
router.use('/', (req, res, next) => {
  req.body.text = striptags(req.body.body);
  if (isHtml(req.body.body)) {
    req.body.html = req.body.body;
  }

  next();
})

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
      logger.warn(response);

      return res.status(500).send(response);
    });
});

module.exports = router;
