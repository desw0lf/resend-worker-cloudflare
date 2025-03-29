
import { getConfig } from "../../utils/get-config";
import { turnstile } from "./turnstile";
// ? TYPES:
import type { IRequest } from "../../types";

const captchaMiddleware = async (request: Omit<IRequest, "query">, env: Env) => {
  const secrets = getConfig<{ profile: string; key: string; }>(env.CAPTCHA_SECRETS);

  const { key } = secrets.find((secret) => secret.profile === request.profile.profile) || {};
  const type = "TURNSTILE";

  if (!key) {
    return;
  }

  if (type === "TURNSTILE") {
    return turnstile(request, key);
  }

  return;
};

export default captchaMiddleware;
