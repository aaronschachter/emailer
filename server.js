'use strict';

require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const logger = require('winston');
logger.configure({
  transports: [
    new (logger.transports.Console)({
      prettyPrint: true,
      colorize: true,
      level: process.env.LOGGING_LEVEL || 'info',
      timestamp: true,
    }),
  ],
});

function checkConfig(key) {
  if (!process.env[key]) {
    logger.error(`${key} undefined`);
    process.exit(1);
  }
}

const provider = process.env.EMAIL_PROVIDER || 'mailgun';
logger.info(`Checking required config vars for ${provider}`);
if (provider === 'mandrill') {
  checkConfig('MANDRILL_API_KEY');
} else {
  checkConfig('MAILGUN_DOMAIN');
  checkConfig('MAILGUN_API_KEY');
}

app.use('/email', require('./app/routes/email'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Running emailer on port:${port} using email service provider:${provider}.`);
});
