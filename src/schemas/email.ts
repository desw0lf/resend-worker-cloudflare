import { z } from "zod";

export const zEmailPayload = z.object({
  _gotcha: z.undefined().or(z.null()),
  id: z.string(), // to
  name: z.string(), // fromLabel
  email: z.string().or(z.array(z.string())), // replyTo
  subject: z.string().optional(),
  message: z.string()
});

const zodOptionalBool = z.union([
  z.boolean(),
  z.string().transform((val) => val === "true")
]).optional();

export const zEmailQuery = z.object({
  noMeta: zodOptionalBool.default(false),
  preventThreading: zodOptionalBool.default(true)
});

export type EmailPayloadSchema = z.infer<typeof zEmailPayload>;
export type EmailQuerySchema = z.infer<typeof zEmailQuery>;