import { error, json } from "itty-router";
import { buildMain } from "../builders/main";
import { buildMeta } from "../builders/meta";
import { Resend } from "resend";
// ? TYPES:
import type { EmailRequestParsed } from "../types";

export default {
	async send({ parsed: fullParsed, query, meta, profile }: EmailRequestParsed, env: Env): Promise<Response> {
		const { react: _2, from: _3, to: _4, ...parsed } = fullParsed;
		const restHeaders = parsed.headers || {};
		const subject = parsed.subject || "Untitled";
		const to = parsed.recipient;
		const from = `${env.EMAIL_SENDER_USERNAME}@${profile.domain}`;

		const resend = new Resend(profile.api_key);
    const { data, error: err } = await resend.emails.send({
			...parsed,
      from: parsed.name ? `${parsed.name} <${from}>` : from,
			replyTo: parsed.email,
      to,
      subject,
      html: buildMain(parsed) + buildMeta(meta, query.includeMeta),
			headers: {
				...query.preventThreading ? { "X-Entity-Ref-ID": Date.now().toString(36) + Math.random().toString(36).substring(2) } : {},
				...restHeaders
			}
    });

		if (err) {
			return error(400, err);
		}

		return json({ message: "OK", status: 200, ...data });
	},
};
