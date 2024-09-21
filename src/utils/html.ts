type Style = Record<string, string | number | undefined> | undefined;

interface Attrs {
  style?: Style;
  [key: string]: string | number | boolean | undefined | Record<string, unknown>;
}

function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

export const html = (element: string, children?: string, { style, ...attributes }: Attrs = {}) => {
  let strAttrs = "";
  let strStyle = "";
  const attrsEntries = Object.entries(attributes);
  const styleEntries = style ? Object.entries(style) : [];
  if (attrsEntries.length > 0) {
    strAttrs = `${attrsEntries.map(([key, value]) => `${key}="${value}"`).join(" ")}`;
  }
  if (styleEntries.length > 0) {
    strStyle = `style="${styleEntries.map(([key, value]) => `${toKebabCase(key)}:${value}`).join(";")}"`;
  }
  let html = "<" + [element, strAttrs, strStyle].filter(Boolean).join(" ");
  if (children) {
    html += `>${children}</${element}>`;
    return html;
  }
  html += "/>";
  return html;
}