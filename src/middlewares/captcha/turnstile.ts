import { error } from "itty-router";
import { parseContent } from "../../utils/parse-content";
import { fetcher } from  "../../utils/fetcher";
import { getCookies } from "../../utils/get-cookies";
// ? TYPES:
import type { IRequest } from "../../types";

type CloudflareTurnstileResponse = {
  success: true;
  "error-codes": [];
  "challenge-ts": string; // e.g. 2022-10-06T00:07:23.274Z
  hostname: string; // e.g. example.com
  action: string; // e.g. login (widget identifier)
  cdata: string; // e.g. sessionid-123456789
  metadata: {
    ephemeral_id: string; // e.g. x:9f78e0ed210960d7693b167e
  }
} | {
  success: false;
  "error-codes": string[]; // e.g ["invalid-input-response"]
};

function appendHeader(request: any, keyValue: [string, string]) {
  request.responseHeaders = [...(request.responseHeaders || []), keyValue];
}

export async function turnstile(request: Omit<IRequest, "query">, key: string) {
  const { "cf-turnstile-response": token } = await parseContent<{ "cf-turnstile-response": string | undefined }>(request);
  const ip: string | null = request.headers.get("cf-connecting-ip");
  const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  const { turnstile_idempotency_key } = getCookies(request); // previousKey
  const idempotency_key = turnstile_idempotency_key || crypto.randomUUID();
  
  const body = {
    secret: key,
    response: token,
    remoteip: ip,
    idempotency_key
  };

  const { response } = await fetcher<CloudflareTurnstileResponse>(url, { body });

  if (response.success) {
    const cookiePath = "/send";
    appendHeader(request, ["Set-Cookie", `turnstile_idempotency_key=${idempotency_key}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600; Path=${cookiePath}`]);
    return;
  }

  const errors = response["error-codes"] || ["?"];
  const code = ["?", "missing-input-secret", "invalid-input-secret", "internal-error"].includes(errors[0]) ? 500 : 400;

  return error(code, { validation: errors.map((message) => ({ message, path: ["cf-turnstile-response"] })) });
}