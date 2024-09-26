import { z } from "zod";

export const zEmailPayload = z.object({
  _gotcha: z.undefined().or(z.null()),
  recipient: z.string().or(z.array(z.string())), // to
  name: z.string().optional(), // fromLabel
  email: z.string().or(z.array(z.string())), // replyTo
  subject: z.string().optional(),
  html: z.string()
}).passthrough();

const zodOptionalBool = z.union([
  z.boolean(),
  z.string().transform((val) => val === "true")
]).optional();

export const zEmailQuery = z.object({
  includeMeta: zodOptionalBool.default(true),
  preventThreading: zodOptionalBool.default(true)
});

type PossibleExtraPayloadValue = string | number | boolean | null;
type DynamicValues = Omit<Record<string, PossibleExtraPayloadValue | PossibleExtraPayloadValue[]>, keyof typeof zEmailPayload.shape>;

export type EmailPayloadSchema = z.infer<typeof zEmailPayload> & DynamicValues;
export type EmailQuerySchema = z.infer<typeof zEmailQuery>;