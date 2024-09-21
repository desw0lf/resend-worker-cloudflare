import { Router, error, json } from "itty-router";
import emailController from "./controllers/email";
import metaMiddleware from "./middlewares/meta";
import authMiddleware from "./middlewares/auth";
import emailValidationMiddleware from "./middlewares/email-validation";
// ? TYPES:
import type { EmailRequest, EmailRequestParsed } from "./types";

const router = Router();

// POST /api/email
router.post<EmailRequest>("/send", authMiddleware, metaMiddleware, emailValidationMiddleware, async (request, env: Env) => {
	try {
		const response = await emailController.send(request as EmailRequestParsed, env);
		return json(response);
	} catch (errorStack: any) {
		console.error(`Error sending email: ${errorStack}`);
		return error(500, { errorStack });
	}

});

router.get("/health", (_request) => {
	return json({ message: "OK", timestampIso: new Date().toISOString(), status: 200 });
});

router.all("*", (_request) => error(404));

export default router satisfies ExportedHandler<Env>;