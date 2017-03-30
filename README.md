# emailer

Emailer is a HTTP service that accepts POST requests with JSON data to an `/email` endpoint, and submits the data to either [Mailgun](https://www.mailgun.com/) or [Mandrill](http://mandrill.com/) to deliver the data as an email message. Emailer is built with [Express](https://expressjs.com/).

### Installation

* Install [Node.js 6.10](https://nodejs.org/en/)
* Clone this repository
* From the cloned redirectory, run `npm install`
* Copy [`.env.example`](https://github.com/aaronschachter/emailer/blob/master/README.md) as `.env` in the root directory, and update the values with your own Mailgun key and Mandrill key/domain
* To start Emailer, run `npm start`
    * Your `email` endpoint will be running on `http://localhost:3000/email`. Specify a different port number by adding a `PORT` variable to your `.env` file.

### Notes

Emailer is built with Node.js because I've been working it daily (well, excluding my paternity leave :hatching_chick:) for over a year now, and enjoy coding in it.

I used Express because it's great for quickly spinning up a webservice and defining endpoints. A few of the many Node.js libraries came in handy for Emailer to avoid re-inventing the wheel:

* [email-validator](https://www.npmjs.com/package/email-validator) - Used to determine if our incoming `to` and `from` parameters contain valid email addresses.

* [is-html](https://www.npmjs.com/package/is-html) - Used to determine if our incoming `body` parameter contains HTML.

* [striptags](https://www.npmjs.com/package/striptags) - Used to strip any HTML from our incoming `body` parameter to use as plain text.

* [superagent](https://www.npmjs.com/package/is-html) - A HTTP client used to POST to our third party services, that has Promise support out of the box. I didn't have time to get to them, but this would have been useful for chaining multiple tasks in each POST request to our 3rd party services, such as:
    * If a request to our default email provider fails, attempt to send the request to the other provider instead.
    * Log all incoming requests and the Emailer response in a database or file.

* [winston](https://www.npmjs.com/package/winston) - A library for logging messages to the console, useful for keeping :eyes: on the logs and/or debugging :mag_left:

Besides the automatic attempt to try the other service, some other nice-to-have features include:
* Attempt to fix invalid HTML sent through in the `body` parameter
* Additional config variables to check if the email domain passed in the `from` parameter is valid for the current email provider
