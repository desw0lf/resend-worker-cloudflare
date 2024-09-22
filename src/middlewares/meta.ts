// ? TYPES:
import type { IRequest, Meta } from "../types";

const metaMiddleware = (request: Omit<IRequest, "query">) => {
  const { latitude, longitude, country, city, timezone, postalCode, region, asOrganization } = request.cf || {};
  const fromHeaders = {
    userAgent: request.headers.get("user-agent"),
    ip: request.headers.get("x-real-ip") || request.headers.get("cf-connecting-ip"),
  };
  const { ip, userAgent } = {
    userAgent: fromHeaders.userAgent ? fromHeaders.userAgent.substring(0, 250) : undefined,
    ip: fromHeaders.ip ? fromHeaders.ip.substring(0, 40) : undefined, // not available when testing locally
  }

  const mapZoom = 7;
  const meta: Meta = {
    latLngUrl: latitude && longitude ? `https://maps.google.com/?q=${latitude},${longitude}&ll=${latitude},${longitude}&z=${mapZoom}` : undefined,
    userAgent,
    ip,
    ipUrl: ip ? `https://whatismyipaddress.com/ip/${ip}` : undefined,
    address: [postalCode, city, region, country].filter(Boolean).join(", "),
    timezone,
    asOrganization,
  };
  // const filtered: Meta = Object.entries(meta).reduce((acc, [key, value]) => !value ? acc : { ...acc, [key]: value }, {});
  request.meta = meta;
};

export default metaMiddleware;


