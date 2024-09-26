import { error } from "itty-router";
import { parseRequest } from "../utils/parse-request";
import encryptionController from "../controllers/encryption";
import { zEmailPayload, zEmailQuery } from "../schemas/email";
// ? TYPES:
import type { EmailRequest } from "../types";

const emailValidationMiddleware = async (request: EmailRequest, env: Env) => {
  const content = await parseRequest(request);
  const parsed = zEmailPayload.safeParse(content);
  if (!parsed.success) {
    return error(400, { validation: parsed.error.issues });
  }
  async function decryptEmailIfNeeded(value: string | string[], salt: string | undefined): Promise<string | string[]> {
    if (Array.isArray(value)) {
      return Promise.all(value.map((email) => decryptEmailIfNeeded(email, salt))) as Promise<string[]>;
    }
    return value.includes("@") || !salt ? Promise.resolve(value) : encryptionController.decrypt(value, salt);
  }
  const recipient = await decryptEmailIfNeeded(parsed.data.recipient, env.SALT);
  request.parsed = {
    ...parsed.data,
    recipient
  };
  const parsedQuery = zEmailQuery.safeParse(request.query);
  if (parsedQuery.success) {
    request.query = parsedQuery.data;
  }
  return;
};

export default emailValidationMiddleware;
