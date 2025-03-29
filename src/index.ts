import { Router, cors, error, json } from "itty-router";
import encryptionController from "./controllers/encryption";
import emailController from "./controllers/email";
import metaMiddleware from "./middlewares/meta";
import authMiddleware from "./middlewares/auth";
import captchaMiddleware from "./middlewares/captcha";
import emailValidationMiddleware from "./middlewares/email-validation";
// ? TYPES:
import type { RouterType } from "itty-router";
import type { EmailRequest, EmailRequestParsed, IRequest } from "./types";

const { preflight, corsify } = cors();
const router: RouterType<IRequest, any[], any> = Router({
  before: [preflight],
  finally: [corsify],
});

router.post<EmailRequest>("/send/:profile?", authMiddleware, captchaMiddleware, metaMiddleware, emailValidationMiddleware, async (request, env: Env) => {
  try {
    const response = await emailController.send(request as EmailRequestParsed, env);
    // return text(undefined, { status: 302, headers: { Location: "https://google.com" } });
    const res = json(response);
    const headerList = request.responseHeaders || [];
    headerList.forEach(([key, value]) => {
      res.headers.append(key, value);
    });
    return res;
  } catch (err: any) {
    console.error(`Error sending email: ${err}`);
    return error(500, err);
  }
});

router.get("/health", (_request) => {
  return json({ message: "OK", timestampIso: new Date().toISOString(), status: 200 });
});

router.get<any>("/encrypt", async (request, env: Env) => {
  if (env.WORKER_ENV !== "local") {
    return;
  }
  if (!env.SALT || !request.query.email) {
    return error(401);
  }
  const encryptedRecipient = await encryptionController.encrypt(request.query.email, env.SALT);
  // const decryptedBack = await encryptionController.decrypt(encryptedRecipient, env.SALT);
  return json({ encryptedRecipient });
})

router.all("*", (_request) => error(404));

export default router satisfies ExportedHandler<Env>;