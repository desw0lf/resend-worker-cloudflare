import { withCookies } from "itty-router";
// ? TYPES:
import type { IRequest } from "../types";

export function getCookies(request: IRequest | Omit<IRequest, "query">) {
  if (!request.cookies) {
    withCookies(request as IRequest);
  }
  return request.cookies;
}