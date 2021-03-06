# emailer

Emailer is a HTTP service that accepts POST requests with JSON data to an `/email` endpoint, and submits the data to either [Mailgun](https://www.mailgun.com/) or [Mandrill](http://mandrill.com/) to deliver the data as an email message. Emailer is built with [Express](https://expressjs.com/).


* [Documentation](https://github.com/aaronschachter/emailer/tree/master/documentation)

### Installation

* Install [Node.js 6.10](https://nodejs.org/en/)
* Clone this repository
* From the cloned redirectory, run `npm install`
* Copy [`.env.example`](https://github.com/aaronschachter/emailer/blob/master/README.md) as `.env` in the root directory, and update the values with your own Mailgun key and Mandrill key/domain
* To start Emailer, run `npm start`
    * Your `email` endpoint will be running on `http://localhost:3000/email`. Specify a different port number by adding a `PORT` variable to your `.env` file.

#### Defaults

* Emailer will use Mailgun by default, but can be configured to use Mandrill instead by setting  `EMAIL_PROVIDER=mandrill` in `.env`.
    
### Tests
* Run `npm test` to execute unit tests

### Notes

Emailer is built with Node.js because I've been working it daily for over a year (well, excluding a few weeks for my paternity leave :hatching_chick:).

I used Express because it's great for quickly spinning up a webservice and defining endpoints. A few of the many Node.js libraries came in handy for Emailer to avoid re-inventing the wheel:

* [winston](https://www.npmjs.com/package/winston) - A library for logging messages to the console, useful for keeping :eyes: on the logs and/or debugging :mag:

* [email-validator](https://www.npmjs.com/package/email-validator) - Used to determine if our incoming `to` and `from` parameters contain valid email addresses.

* [html-to-text](https://www.npmjs.com/package/html-to-text) - Used when `EMAIL_PROVIDER=mailgun`,  converts HTML in our `body` parameter to plain text. We don't use this library when posting to Mandrill,  relying on [their `auto_text` parameter](https://mandrillapp.com/api/docs/messages.html) to do the lifting instead.

* [superagent](https://www.npmjs.com/package/is-html) - A HTTP client used to POST to our third party services, that has Promise support out of the box. I didn't have time to get to them, but this would have been useful for chaining multiple tasks in each POST request to our 3rd party services, such as:
    * If a request to our default email provider fails, attempt to send the request to the secondary provider to avoid a configuration change and app restart.
    * Log all incoming requests and the Emailer response in a database or file. Additionally query out to the email provider service to verify sent for messages that are queued, and store if/when message was sent.


Besides the two ideas listed above under the Superagent description, some other would-have-been-to-build-with-more-time Emailer features include:

* Require authentication / API key to post to the Emailer API

* Throttle incoming API requests

* Implement a message broker to queue third party POST requests

* More descriptive network error messages returned for certain issues (e.g. passing an invalid API keys.  returns `Internal Server Error`)

* Use a library like [Nock](https://github.com/node-nock/nock) to mock Mailgun and Mandrill responses and add test coverage for the Mandrill and Mailgun `postMessage` functions.

* Attempt to fix invalid HTML sent through in the `body` parameter as valid HTML

* Additional config variables to check if the email domain passed in the `from` parameter is valid for the current email provider

* Code linting


