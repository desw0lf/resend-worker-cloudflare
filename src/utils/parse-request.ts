// ? TYPES:
import type { EmailRequest } from "../types";

export async function parseRequest(request: EmailRequest) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType === "application/json") {
    const content = await request.json();
    return content;
  }
  
  if (contentType.startsWith("application/x-www-form-urlencoded")) {
    const formData = await request.formData();
    console.log(formData);
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
    
    return data;
  }

  throw new Error("Unsupported content type");
}
