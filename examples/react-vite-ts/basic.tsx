import { useState } from "react";
import { useFetch } from "./hooks/use-fetch.ts";

export const BasicContactForm = () => {
  const [status, setStatus] = useState<"IDLE" | "LOADING" | "SUCCESS" | "ERROR">("IDLE");
  const betterFetch = useFetch();
  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setStatus("LOADING");
    const values = Object.fromEntries(new FormData(e.target as HTMLFormElement)) as { [k: string]: string };
    const body = {
      recipient: [import.meta.env.VITE_CONTACT_RECIPIENT],
      ...values
    };
    const { error, status } = await betterFetch(import.meta.env.VITE_CONTACT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (status === 200) {
      setStatus("SUCCESS");
      return;
    }
    setStatus("ERROR");
    alert(error.error || error.message || `Error: ${status}`);
  }
  return <form onSubmit={onFormSubmit} action="/enable-js" method="POST" data-status={status}>
    <code id="debug">[Status: {status}]</code>
    <input type="hidden" name="subject" value="From Contact Form" />
    <input type="text" placeholder="Name" name="name" />
    <input type="text" placeholder="Email" name="email" />
    <textarea name="html" placeholder="Message"></textarea>
    <footer>
      <button type="submit" disabled={["LOADING", "SUCCESS"].includes(status)}>
        <span>{status !== "SUCCESS" ? "Send" : "Sent"}</span>
      </button>
    </footer>
  </form>;
}