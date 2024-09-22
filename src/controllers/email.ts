import { error, json } from "itty-router";
import { buildMeta } from "../builders/meta";
import { Resend } from "resend";
// ? TYPES:
import type { EmailRequestParsed } from "../types";

export default {
	async send({ parsed, query, meta, profile }: EmailRequestParsed, env: Env): Promise<Response> {
		const template = {
			footer: "",
			main: ""
		};
		if (!query.noMeta) {
			template.footer = buildMeta(meta);
		}
		const subject = parsed.subject || "Untitled";
		const to = parsed.id;
		template.main = `<p>${parsed.message}</p>`;

		const resend = new Resend(profile.api_key);
    const { data, error: err } = await resend.emails.send({
      from: `${parsed.name} <${env.EMAIL_SENDER_USERNAME}@${profile.domain}>`,
			replyTo: parsed.email,
      to: to,
      subject: subject,
      html: template.main + template.footer,
			headers: {
				...query.preventThreading ? { "X-Entity-Ref-ID": Date.now().toString(36) + Math.random().toString(36).substring(2) } : {},
			}
    });

		if (err) {
			return error(400, { errorStack: err });
		}

		return json({ message: "OK", status: 200, ...data });
	},
};
