import { z } from "zod";

export const zProfile = z.object({
  profile: z.string(),
  api_key: z.string().startsWith("re_", { message: "must start with 're_'" }),
  domain: z.string().regex(/\./, { message: "invalid domain" }),
});

export type ProfileSchema = z.infer<typeof zProfile>;