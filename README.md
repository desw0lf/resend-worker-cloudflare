# Resend.com Emails using Cloudflare Workers

> Send transactional emails from your Cloudflare Workers using Resend.com. Perfect for contact forms.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Usage](#usage)
  - [Sending Emails](#sending-emails)
  - [Encrypting Emails](#encrypting-emails)
- [Environment Variables](#environment-variables)
- [Changing the Sender Username](#changing-the-sender-username)

## Prerequisites

1. **Add your domain to Resend.com**: Follow the instructions on the [Resend.com dashboard](https://resend.com/docs/dashboard/domains/cloudflare) to add your domain.
2. **Generate Resend.com API key**: Create a new API key with `Sending access` permission. This will be used to authenticate your emails.

## Getting Started

1. **Install dependencies**: Run `npm install` to install the required dependencies.
2. **Run the setup script**: Run `./cli.js` and follow the instructions.

This will create a `.dev.vars` file with your `RESEND_CONFIG` and `SALT` values.
4. **Set environment variables**: Use the created `RESEND_CONFIG` and `SALT` values and run:
   * `npx wrangler secret put RESEND_CONFIG`
   * `npx wrangler secret put SALT`
   _(Alternatively, you can set these values via your Cloudflare Dashboard.)_
5. **Deploy the Cloudflare Worker**: Run `npm run deploy` to deploy the Cloudflare Worker.

## Usage

This section covers how to use the Cloudflare Worker to send emails through Resend.com and how to encrypt email addresses for added security.

### Sending Emails

To send an email, make a request to the Cloudflare Worker with the required parameters. The worker handles the email sending process using Resend.com, based on the [Resend.com - [POST] Send Email endpoint](https://resend.com/docs/api-reference/emails/send-email).

#### Request Payload
`[POST] /send/:profile`

Content type: `application/json` and `application/x-www-form-urlencoded` are supported.

_(Alternatively `[POST] /send` with the `profile` header.)_

Required payload values:
* `recipient`: The recipient email address. For multiple addresses, send as an array of strings. Max 50. e.g. "yourpersonalemail@gmail.com" (**this can be the encrypted email or plain email**)
* `email`: The reply-to email address. For multiple addresses, send as an array of strings, e.g. "john.smith@example.com"
* `html`: The HTML version of the message

Optional values:
* `name`: The sender label, e.g. "John Smith".
* `subject`: The email subject.
* `bcc`: The Bcc recipient email address. For multiple addresses, send as an array of strings.
* `cc`: The Cc recipient email address. For multiple addresses, send as an array of strings.
* `scheduled_at`: Schedule email to be sent later. The date should be in ISO 8601 format (e.g: 2024-08-05T11:52:01.858Z).
* `reply_to`: The reply-to email address. For multiple addresses, send as an array of strings.
* `text`: The plain text version of the message.
* `headers`: Custom headers to add to the email.
* `attachments`: Filename and content of attachments (max 40mb per email).
* `tags`: Custom data passed in key/value pairs.
* Any key starting with `:` will be appended to the `html` message as additional content.

#### Example Request

`[POST] /send/main`

```json
{
  "recipient": "john.smith@example.com",
  "name": "John Smith",
  "email": "john@gmail.com",
  "html": "<p>My sample message from API</p>",
  "subject": "What is love?",
  ":Favourite pet": "Dragon",
  ":Favourite Colour": "Orange"
}
```

[Bruno](https://www.usebruno.com/) collection available in `bruno` folder.

_Note: From Resend.com the `react`, `from`, `to` parameters are not supported._

#### Search Parameters

Optional parameters:
* `includeMeta`: Should collect information about the sender, such as userAgent, Location, IP address etc (default: true) 
* `preventThreading`: Should prevent threading e.g. in Gmail (default: true)

### Encrypting Emails

For added security, you can encrypt email addresses before sending them. There are two methods to encrypt an email:

1. Use the Node script:
   Run the following command to set up encryption dependency and encrypt an email:
      ```
      npm run encryption-setup && ./encrypt.mjs --encrypt=johndoe@example.com
      ```


2. Run your worker locally and use the encrypt endpoint:
   ```
   npm run start
   ```
   Then navigate to `http://localhost:8787/encrypt?email=johndoe@example.com`

   _Note: This endpoint is not exposed to live._

## Environment Variables

The following environment variables are used in this project:

* `RESEND_CONFIG`: includes:
  + API key from Resend.com (`api_key`)
  + Domain name used in Resend.com setup (`domain`)
  + Custom profile name (`profile`) (used in request 'profile' header)
* `SALT`: a random value used for encryption

## Changing the Sender Username

By default, the sender username is set to `submissions-noreply`, which translates to the sender being `submissions-noreply@yourdomain.com`. If you wish to change this, you can edit the `EMAIL_SENDER_USERNAME` value in `wrangler.toml` and deploy, or set it via your Cloudflare Dashboard.
