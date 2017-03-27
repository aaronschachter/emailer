'use strict';

const express = require('express')
const router = express.Router();
const logger = require('winston');

function missingEmailParams(data) {
  if (!data) {
    return true;
  }

  const requiredParams = ['to', 'to_name', 'from', 'from_name', 'subject', 'body'];

  return requiredParams.some(paramName => !data[paramName]);
}

router.use('/', (req, res, next) => {
  logger.debug(`POST /email req.body:${JSON.stringify(req.body)}`);

  if (missingEmailParams(req.body)) {
    const msg = 'Missing required body parameters.';
    logger.warn(msg);
    res.status(422).send(msg);
    return;
  }

  next();
});

router.post('/', (req, res) => {
  const msg = 'Message sent.';
  logger.info(msg);
  res.send(msg);
});

module.exports = router;
