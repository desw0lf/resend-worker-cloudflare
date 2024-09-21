import { error } from "itty-router";
import { zEmailPayload } from "../schemas/email";
// ? TYPES:
import type { EmailRequest } from "../types";

const emailValidationMiddleware = async (request: EmailRequest) => {
	const content = await request.json();
	const parsed = zEmailPayload.safeParse(content);
	if (parsed.success) {
		request.parsed = parsed.data;
		return;
	}

	return error(400, { validation: parsed.error.issues });
};

export default emailValidationMiddleware;
