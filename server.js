'use strict';

require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const logger = require('winston');
logger.level = process.env.LOGGING_LEVEL || 'info';

function missingEmailParams(data) {
  if (!data) {
    return true;
  }

  const requiredParams = ['to', 'to_name', 'from', 'from_name', 'subject', 'body'];

  return requiredParams.some(paramName => !data[paramName]);
}

app.use('/email', (req, res, next) => {
  logger.debug(`POST /email req.body:${JSON.stringify(req.body)}`);

  if (missingEmailParams(req.body)) {
    const msg = 'Missing required body parameters.';
    logger.warn(msg);
    res.status(422).send(msg);
    return;
  }

  next();
})

app.post('/email', (req, res) => {
  const msg = 'Message sent.';
  logger.info(msg);
  res.send(msg);
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Running emailer on port ${port}...`);
});
