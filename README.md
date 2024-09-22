# Resend.com Emails using Cloudflare Workers
> Send transactional emails from your Cloudflare Workers using Resend.com. Perfect for contact forms.

## Prerequisites
1. [Add your domain to Resend.com](https://resend.com/docs/dashboard/domains/cloudflare)
2. Generate Resend.com API key (`Sending access` Permission is sufficient)

## ENV Variables
`RESEND_CONFIG` - which includes: 
1. API key from Resend.com <`api_key`>
2. Domain name used in Resend.com setup <`domain`>
3. Custom profile name <`profile`> (used in request 'profile' header)


_(To add multiple profiles, you can use the `|` delimiter)_

Please look at `.dev.SAMPLE.vars` for an example, and to run locally create a `.dev.vars` with the provided keys, and filled in values.

### Adding ENV variables/secrets via CLI
`npx wrangler secret put RESEND_CONFIG`