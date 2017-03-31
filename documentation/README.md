# API 

### Email
Posts incoming request data to a third party service to deliver it as an email message.
```
POST /email
```
Emailer posts messages to Mailgun by default. Set the `EMAIL_PROVIDER` config variable to `mandrill` to use Mandrill instead.

#### Parameters
All input fields are required.

Name | Type | Description
--- | --- | ---
**`to`** | `string` | The email address to send to
**`to_name`** | `string` | The name to accompany the email
**`from`** | `string` | The email address in the from and reply fields
**`from_name`** | `string` | The name to accompany the from/reply emails
 **`subject`** | `string` | The subject line of the email 
 **`body`**  | `string` | the HTML body of the email
 
#### Response
Name | Type | Description
--- | --- | ---
**`message`** | `string` | Information about the success or error
**`provider`** | `string` | The current Emailer provider service set, either `mailgun` or `mandrill`
**`provider_response`** | `object` | The response returned from the provider API

#### Example request

````
curl -X "POST" "http://localhost:3000/email" \
     -H "Content-Type: application/json; charset=utf-8" \
     -d $'{
  "to": "rick@walkingdead.com",
  "to_name": "Rick"
  "from_name": "Neegan",
  "from": "neegan@walkingdead.com",
  "subject": "Hello from the Saviors",
  "body": "<h1>Whats up friend?</h1><p>Got a minute to chat?</p>",
}'
````

#### Example response

````
{
  "provider":"mailgun",
  "message":"Success!",
  "provider_response": {
    "id":"<20170331012813.43203.16948.3F68512E@sandbox82cba912e9174942a9fe79084f8698b1.mailgun.org>",
    "message":"Queued. Thank you."
  }
 }
````
