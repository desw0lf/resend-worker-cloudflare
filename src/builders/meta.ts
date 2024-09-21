import { html } from "../utils/html";
// ? TYPES: 
import type { Meta } from "../types";

export const buildMeta = (meta: Meta) => {
  const footerList = [
    meta.userAgent,
    meta.ipUrl ? html("a", "IP address", { href: meta.ipUrl, target: "_blank" }) : null,
    meta.timeZone ? `TZ: ${meta.timeZone}` : null,
    meta.asOrganization,
    meta.address && meta.latLngUrl ? html("a", meta.address, { href: meta.latLngUrl, target: "_blank" }) : null,
    meta.address && !meta.latLngUrl ? meta.address : null
  ].filter(Boolean);
  
  const colour = "#a0a0a0";
  const style = { fontSize: "11px", borderTop: `1px dotted ${colour}`, color: colour, paddingTop: "6px", marginTop: "6px", fontFamily: "sans-serif" };
  return html("div", footerList.join(" | "), { style });
}