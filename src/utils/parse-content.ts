// ? TYPES:
import type { IRequest } from "../types";

export async function parseContent<T = any>(request: Omit<IRequest, "query">): Promise<T> {
  if (request.parsedContent) {
    return request.parsedContent;
  }
  const contentType = request.headers.get("content-type") || "";
  if (contentType === "application/json") {
    const content = await request.json();

    request.parsedContent = content;
    return content;
  }
  
  if (contentType.startsWith("application/x-www-form-urlencoded")) {
    const formData = await request.formData();
    const data: Record<string, string | string[]> = {};
    for (const [key, value] of formData.entries()) {
      if (formData.getAll(key).length > 1) {
        if (data[key]) {
          continue;
        }
        data[key] = formData.getAll(key).map((v: any) => v.toString())
      }

      data[key] = value.toString();
    }
    
    request.parsedContent = data;
    return data as T;
  }

  throw new Error("Unsupported content type");
}
