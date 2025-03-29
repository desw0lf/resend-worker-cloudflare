# Resend.com Emails using Cloudflare Workers

> Send transactional emails from your Cloudflare Workers using Resend.com. Perfect for contact forms.

[![demo_contact_gif](https://github.com/user-attachments/assets/4c521d52-3412-4760-ae72-9e617b016023)](#)
[![demo_payload](https://github.com/user-attachments/assets/1c233d41-4e3e-45d6-976f-050b5bbf93cc)](#)
[![demo_output](https://github.com/user-attachments/assets/1903a877-b84a-4ce2-858b-ef6bc94521ae)](#)

## Table of Contents
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Usage](#usage)
  - [Sending Emails](#sending-emails)
  - [Encrypting Emails](#encrypting-emails)
- [Environment Variables](#environment-variables)
- [Changing the Sender Username](#changing-the-sender-username)
- [Adding Cloudflare Turnstile captcha](#adding-cloudflare-turnstile-captcha)

## Prerequisites

1. **Add your domain to Resend.com**: Follow the instructions on the [Resend.com dashboard](https://resend.com/docs/knowledge-base/cloudflare) to add your domain.
2. **Generate Resend.com API key**: Create a new API key with `Sending access` permission. This will be used to authenticate your emails.

## Getting Started

### Quick Deployment
[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/desw0lf/resend-worker-cloudflare)

<details>
<summary><h3>Manual Deployment</h3></summary>

1. **Install dependencies**: Run `npm install` to install the required dependencies.
2. **Run the setup script**: Run `./cli.js` and follow the instructions.

This will create a `.dev.vars` file with your `RESEND_CONFIG` and `SALT` values.

3. **Set environment variables**: Use the created `RESEND_CONFIG` and `SALT` values and run:
   * `npx wrangler secret put RESEND_CONFIG`
   * `npx wrangler secret put SALT`
   
   _(Alternatively, you can set these values via your Cloudflare Dashboard.)_
4. **Deploy the Cloudflare Worker**: Run `npm run deploy` to deploy the Cloudflare Worker.
</details>

## Usage

This section covers how to use the Cloudflare Worker to send emails through Resend.com and how to encrypt email addresses for added security.

### Sending Emails

To send an email, make a request to the Cloudflare Worker with the required parameters. The worker handles the email sending process using Resend.com, based on the [Resend.com - [POST] Send Email endpoint](https://resend.com/docs/api-reference/emails/send-email).

#### Request Payload
`[POST] /send/:profile` OR `[POST] /send` with the `profile` header

_Content type: `application/json` and `application/x-www-form-urlencoded` are supported._

Required payload values:
* `recipient`: string | string[] - The recipient email address. Max 50. e.g. "yourpersonalemail@gmail.com" (**this can be the encrypted email or plain email**)
* `email`: string | string[] - The reply-to email address. e.g. "john.smith@example.com"
* `html`: string - The HTML version of the message

Optional values:
* `name`: string - The sender label, e.g. "John Smith".
* `subject`: string - The email subject.
* `bcc`: string | string[] - The Bcc recipient email address.
* `cc`: string | string[] - The Cc recipient email address.
* `scheduled_at`: string - Schedule email to be sent later. The date should be in ISO 8601 format (e.g: 2024-08-05T11:52:01.858Z).
* `text`: string - The plain text version of the message.
* `headers`: object - Custom headers to add to the email.
* `attachments`: object[] - Filename and content of attachments (max 40mb per email) ([example](https://resend.com/docs/dashboard/emails/attachments)).
* `tags`: object[] - Custom data passed in key/value pairs ([example](https://resend.com/docs/dashboard/emails/tags)).
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

_Note: From Resend.com the `react`, `from`, `to`, `reply_to` parameters are not supported._

#### Search Parameters

Optional parameters:
* `includeMeta`: Should collect information about the sender, such as userAgent, Location, IP address etc (default: `true`) 
* `preventThreading`: Should prevent threading e.g. in Gmail (default: `true`)

### Encrypting Emails

For added security, you can encrypt the recipient email address before including it in the payload.

Run your worker locally and use the encrypt endpoint:

  ```
  npm run start
  ```
  Then navigate to `http://localhost:8787/encrypt?email=johndoe@example.com`

  _Note: This endpoint is not exposed to live._

## Environment Variables

The following environment variables are used in this project:
[![resend_config_preview](https://github.com/user-attachments/assets/0c7edbc7-9758-4dd8-8433-7defc6680ce5)](#)

* `RESEND_CONFIG`*: includes:
  + API key from Resend.com (`api_key`)
  + Domain name used in Resend.com setup (`domain`)
  + Custom profile name (`profile`) (used in request 'profile' header or path param)

_Multiple configs supported via `|` separator_

### Optional
* `SALT`: a random value used for recipient email encryption (if you want to obfuscate your email address)
* `CAPTCHA_SECRETS`: Cloudflare Turnstile captcha secrets keys (if you need captcha validation before sending email)

## Changing the Sender Name/Label

By default, the sender username is set to `submissions-noreply`, which translates to the sender being `submissions-noreply@yourdomain.com`. If you wish to change this, you can edit the `EMAIL_SENDER_USERNAME` value in `wrangler.toml` and deploy, or set it via your Cloudflare Dashboard.

## Adding Cloudflare Turnstile captcha
Follow the [Get started with Turnstile](https://developers.cloudflare.com/turnstile/get-started/) guide and use the turnstile `sitekey` in `CAPTCHA_SECRETS` environment variable. For example: `profile=main&key=1x0000000000000000000000000000000AA`


## Roadmap
- Add configurable CORS policies