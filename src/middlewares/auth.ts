
import { zProfile } from "../schemas/profile";
import { getConfig } from "../utils/get-config";
import { error } from "itty-router";
// ? TYPES:
import type { ProfileSchema } from "../schemas/profile";
import type { IRequest } from "../types";

const authMiddleware = (request: Omit<IRequest, "query">, env: Env) => {
  if (!env.RESEND_CONFIG) {
    return error(401, { description: "INVALID SETUP" });
  }

  const profileHeader = request.headers.get("profile") || request.params.profile;

  const profiles = getConfig<ProfileSchema>(env.RESEND_CONFIG);

  const found = profiles.find((profile) => profile.profile === profileHeader);

  if (!found) {
    return error(401);
  }

  const parsed = zProfile.safeParse(found);

  if (!parsed.success) {
    return error(401, { description: "INVALID SETUP", validation: parsed.error.issues });
  }

  request.profile = parsed.data;
};

export default authMiddleware;
