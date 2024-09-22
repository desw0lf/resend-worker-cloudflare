// ? TYPES:
import { IRequest } from "itty-router";
import { EmailPayloadSchema, EmailQuerySchema } from "./schemas/email";
import { ProfileSchema } from "./schemas/profile";


export { EmailPayloadSchema };

export interface IRequest extends IRequest {
	meta?: Meta;
}

type RequestExtend = {
	parsed?: EmailPayloadSchema;
	query: EmailQuerySchema;
	profile: ProfileSchema;
}
export type EmailRequest = Omit<IRequest, "query"> & RequestExtend;

export type EmailRequestParsed = Omit<IRequest, "query"> & Required<RequestExtend>;

export interface Meta extends Record<string, string | undefined> {
	ip?: string;
	latLngUrl?: string;
	ipUrl?: string;
}