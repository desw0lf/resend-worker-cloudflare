import { error } from "itty-router";
// ? TYPES:
import type { IRequest } from "../types";

const authMiddleware = (request: Omit<IRequest, "query">, env: Env) => {
  if (!env.RESEND_API_KEY || !env.AUTHORIZATION_TOKEN || !env.RESEND_YOUR_DOMAIN || env.RESEND_YOUR_DOMAIN.indexOf(".") < 0) {
		return error(401, { description: "INVALID SETUP" });
	}

	const token = request.headers.get("Authorization");

	if (token !== env.AUTHORIZATION_TOKEN) {
		return error(401);
	}
};

export default authMiddleware;
