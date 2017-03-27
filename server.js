'use strict';

require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use('/email', require('./app/routes/email'));

const logger = require('winston');
logger.level = process.env.LOGGING_LEVEL || 'info';

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Running emailer on port ${port}...`);
});
