# Resend.com Emails using Cloudflare Workers
> Send transactional emails from your Cloudflare Workers using Resend.com. Perfect for contact forms.

## Prerequisites
1. [Add your domain to Resend.com](https://resend.com/docs/dashboard/domains/cloudflare)
2. Generate Resend.com API key

## ENV Variables
`RESEND_API_KEY` - API key from Resend.com
`RESEND_YOUR_DOMAIN` - Domain name used Resend.com setup
`AUTHORIZATION_TOKEN` - Custom Authorization token (can be any value you want, used in request 'Authorization' header)

Please look at `.dev.SAMPLE.vars` for examples, and to run locally create a `.dev.vars` with the provided keys, and filled in values.

### Adding ENV variables/secrets via CLI
`npx wrangler secret put VARIABLE_NAME_HERE`