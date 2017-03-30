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
  let postEmail;
  if (process.env.EMAIL_PROVIDER === 'mandrill') {
    postEmail = emailer.mandrill(req.body);
  }
    postEmail = emailer.mailgun(req.body);
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
