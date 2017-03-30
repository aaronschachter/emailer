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
  if (process.env.EMAIL_PROVIDER === 'mandrill') {
    postMessage = mandrill.postMessage(data);
  } else {
    postMessage = mailgun.postMessage(data);
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
