import { error } from "itty-router";
import { zEmailPayload, zEmailQuery } from "../schemas/email";
// ? TYPES:
import type { EmailRequest } from "../types";

const emailValidationMiddleware = async (request: EmailRequest) => {
	const content = await request.json();
	const parsed = zEmailPayload.safeParse(content);
	if (parsed.success) {
		request.parsed = parsed.data;
		const parsedQuery = zEmailQuery.safeParse(request.query);
		if (parsedQuery.success) {
			request.query = parsedQuery.data;
		}
		return;
	}

	return error(400, { validation: parsed.error.issues });
};

export default emailValidationMiddleware;
