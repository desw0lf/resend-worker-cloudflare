import { Resend } from "resend";

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const RESEND_API_KEY = env.RESEND_API_KEY;
		const fromDomain =  env.FROM_DOMAIN;
		const defaultValues = {};
		const fromUsername = "contact-noreply";
		const fromLabel = "Info";
		const resend = new Resend(RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: `${fromLabel} <${fromUsername}@${fromDomain}>`,
			replyTo: ["anything@dasdsa46.com"],
      to: "sample@example654.com",
      subject: "Hello World2",
      html: "<p>Hello3 from Workers</p>",
    });

		if (error) {
			return Response.json({ error }, { status: 400 });
		}

		return Response.json(data);
	},
} satisfies ExportedHandler<Env>;
