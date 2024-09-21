// ? TYPES:
import { IRequest } from "itty-router";
import { EmailPayloadSchema, EmailQuerySchema } from "./schemas/email";


export { EmailPayloadSchema };

export interface IRequest extends IRequest {
	meta?: Meta;
}

type RequestExtend = {
	parsed?: EmailPayloadSchema;
	query: EmailQuerySchema;
}
export type EmailRequest = Omit<IRequest, "query"> & RequestExtend;

export type EmailRequestParsed = Omit<IRequest, "query"> & Required<RequestExtend>;

export interface Meta extends Record<string, string | undefined> {
	ip?: string;
	latLngUrl?: string;
	ipUrl?: string;
}