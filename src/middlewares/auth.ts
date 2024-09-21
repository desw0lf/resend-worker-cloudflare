import { error } from "itty-router";

const authMiddleware = (request: Request, env: Env) => {
  if (!env.RESEND_API_KEY || !env.CUSTOM_TOKEN || !env.FROM_DOMAIN || env.FROM_DOMAIN.indexOf(".") < 0) {
		return error(401, { description: "INVALID SETUP" });
	}

	const token = request.headers.get("Authorization");

	if (token !== env.CUSTOM_TOKEN) {
		return error(401);
	}
};

export default authMiddleware;
