
type FetchOptions = Omit<RequestInit, "body"> & { 
  body?: BodyInit | null | Record<string, string | undefined | boolean | number | null>;
};

type FnOptions = { stringifyBody?: boolean; defaultValue?: any };

export async function fetcher<T = Record<string, string>>(url: string, fetchOptions: FetchOptions, { stringifyBody = true, defaultValue = {} }: FnOptions = {}): Promise<{ response: T; status: number }> {
  const options: RequestInit = {
    headers: { "Content-Type": "application/json", ...(fetchOptions.headers || {}) },
    method: "POST",
    ...fetchOptions,
    body: fetchOptions.body && stringifyBody && typeof fetchOptions.body === "object" ? JSON.stringify(fetchOptions.body) : fetchOptions.body as RequestInit["body"],
  };
  const result = await fetch(url, options);
  const contentType = result.headers.get("content-type") || "";
  const response: T = contentType.includes("application/json") ? await result.json() as T : defaultValue as T; // maybe try catch better
  return {
    response,
    status: result.status
  };
}