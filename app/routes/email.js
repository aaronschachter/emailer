'use strict';

const express = require('express')
const router = express.Router();
const logger = require('winston');
const emailer = require('../../lib/email')

function missingEmailParams(data) {
  if (!data) {
    return true;
  }

  const requiredParams = ['to', 'to_name', 'from', 'from_name', 'subject', 'body'];

  return requiredParams.some(paramName => !data[paramName]);
}

router.use('/', (req, res, next) => {
  if (missingEmailParams(req.body)) {
    const msg = 'Missing required body parameters.';
    logger.warn(msg);
    res.status(422).send(msg);
    return;
  }

  next();
});

router.post('/', (req, res) => {
  return emailer.mailgun(req.body)
    .then((response) => {
      logger.debug(response.text);

      return res.status(response.status).send(JSON.parse(response.text));
    })
    .catch((err) => {
      logger.error(err);

      return res.status(500).send(err.message);
    });
});

module.exports = router;
