// ? TYPES:
import { IRequest } from "itty-router";
import { EmailPayloadSchema } from "./schemas/email";


export { EmailPayloadSchema };

type RequestExtend = {
	parsed?: EmailPayloadSchema;
}
export type EmailRequest = IRequest & RequestExtend;

export type EmailRequestParsed = IRequest & Required<RequestExtend>;