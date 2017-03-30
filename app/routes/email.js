'use strict';

const express = require('express');
const router = express.Router();

const emailValidator = require('email-validator');
const helpers = require('../../lib/helpers');
const isHtml = require('is-html');
const logger = require('winston');

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
 * Store req.body.body as req.body.html if it contains valid HTML.
 */
router.use('/', (req, res, next) => {
  if (isHtml(req.body.body)) {
    req.body.html = req.body.body;
  }

  next();
})

/**
 * Post incoming request parameters to our email provider to send them as an email.
 */
router.post('/', (req, res) => {
  const data = req.body;

  let postMessage;
  if (process.env.EMAIL_PROVIDER === 'mandrill') {
    postMessage = helpers.postMandrillMessage(data);
  } else {
    postMessage = helpers.postMailgunMessage(data);
  }

  return postMessage
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
