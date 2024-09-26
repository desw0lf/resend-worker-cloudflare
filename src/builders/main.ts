import { html } from "../utils/html";
// ? TYPES: 
import type { EmailPayloadSchema } from "../types";

export const buildMain = (parsed: EmailPayloadSchema) => {
  const extraKeys = Object.entries(parsed).filter(([key]) => key.startsWith(":"));
  const extraKeysCount = extraKeys.length;
  const extraLastIndex = extraKeysCount - 1;
  const { borderRight, padding, display, minWidth } = { borderRight: "1px solid #ddd", padding: "4px 8px", display: "inline-block !important", minWidth: "122px" };
  const extraKeysStyles = extraKeys.map((_, i) => {
    if (extraLastIndex === 0) {
      return { display, minWidth };
    }
    if (i === extraLastIndex) {
      return { display, minWidth, padding };
    }
    // if (i === 0) {
    //   return { display, minWidth, padding, borderRight };
    // }
    return { display, minWidth, padding, borderRight };
  });
  const extraKeysChildren = extraKeys.map(([key, value], i) => html("td", html("h4", key.substring(1), { style: { marginTop: 0, marginBottom: "1px", fontSize: "13px" }}) + value, { style: extraKeysStyles[i] })).join("");
  const extraKeysAttrs = { style: { border: "none", borderCollapse: "collapse" }, role: "presentation", border: 0, cellpadding: 0, cellspacing: 0 };
  const extraKeysHtml = extraKeysCount > 0 ? html("table", html("tr", extraKeysChildren), extraKeysAttrs) : "";

  return html("div", html("p", parsed.html) + extraKeysHtml, { style: { fontFamily: "sans-serif" }});
}