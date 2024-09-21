import { error, json } from "itty-router";
import { Resend } from "resend";
// ? TYPES:
import type { EmailRequestParsed } from "../types";

export default {
	async send({ parsed }: EmailRequestParsed, env: Env): Promise<Response> {
		const RESEND_API_KEY = env.RESEND_API_KEY;
		const RESEND_DOMAIN =  env.RESEND_YOUR_DOMAIN;
		const fromUsername = "contact-noreply"; // todo
		const subject = parsed.subject || "Untitled";
		const to = parsed.id;
		const html = `<p>${parsed.message}</p>`;

		const resend = new Resend(RESEND_API_KEY);
    const { data, error: err } = await resend.emails.send({
      from: `${parsed.name} <${fromUsername}@${RESEND_DOMAIN}>`,
			replyTo: parsed.email,
      to: to,
      subject: subject,
      html: html,
    });

		if (err) {
			return error(400, { errorStack: err });
		}

		return json({ message: "OK", status: 200, ...data });
	},
};
