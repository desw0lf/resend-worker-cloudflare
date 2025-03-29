// "profile=main&api_key=re_abcdef1h_AAb2cd3efg4B5hCiDEFjGklH&domain=yourdomain.com|profile=johnsite&api_key=re_123&domain=anotherdomain.com"
// --> [
//   { profile: "main", api_key: "re_abcdef1h_AAb2cd3efg4B5hCiDEFjGklH", domain: "yourdomain.com" },
//   { profile: "johnsite", api_key: "re_123", domain: "anotherdomain.com" }
// ]

export function getConfig<T extends Record<string, string>>(fullConfStr: string | undefined, delim = "|"): T[] {
  if (!fullConfStr) return [];
  return fullConfStr.split(delim).map((confStr) => Object.fromEntries(new URLSearchParams(confStr).entries()) as T);
}