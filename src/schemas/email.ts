import { z } from "zod";

export const zEmailPayload = z.object({
  _gotcha: z.undefined().or(z.null()),
  id: z.string(), // to
  name: z.string(), // fromLabel
  email: z.string().or(z.array(z.string())), // replyTo
  subject: z.string().optional(),
  message: z.string()
});

export type EmailPayloadSchema = z.infer<typeof zEmailPayload>;