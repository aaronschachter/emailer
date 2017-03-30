'use strict';

require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use('/email', require('./app/routes/email'));

const logger = require('winston');
logger.configure({
  transports: [
    new (logger.transports.Console)({
      prettyPrint: true,
      colorize: true,
      level: process.env.LOGGING_LEVEL || 'info',
    }),
  ],
});

// TODO: Check that all required config variables have been set.

const port = process.env.PORT || 3000;
const provider = process.env.EMAIL_PROVIDER || 'mailgun';

app.listen(port, () => {
  logger.info(`Running emailer on port:${port} with provider:${provider}.`);
});
