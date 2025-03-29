import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { useSimpleForm } from "./hooks/use-simple-form.ts";
import { useFetch } from "./hooks/use-fetch.ts";
import { ContactInput } from "./components/contact-input.tsx";
import { ContactError } from "./components/contact-error.tsx";
import SendIcon from "./components/send-svg.tsx";
import validators from "./validators/contact.validator.ts";
// sample:
import "./_extras/sample-styles.css";

// if using captcha, requires: `npm i @marsidev/react-turnstile`

const inputs = [
  { name: "name" },
  { name: "email" },
  { name: ":phone", label: "Phone" },
  { name: "html", label: "How can we help?", type: "textarea" }
];

export const AdvancedContactFormWithCaptcha = () => {
  const [captchaStatus, setCaptchaStatus] = useState<"IDLE" | "SUCCESS" | "ERROR">("IDLE");
  const betterFetch = useFetch();
  const { onFormSubmit, status, setErrors, onTouchedDeleteError, apiValidationToErrors, errors } = useSimpleForm({ 
    validators,
    onSuccess: async (formValues, formElement) => {
      const body = {
        recipient: [import.meta.env.VITE_CONTACT_RECIPIENT],
        subject: `(${formValues.name} - ${window.location.hostname})`,
        ...formValues
      };

      const { error, status } = await betterFetch(import.meta.env.VITE_CONTACT_URL, {
        method: formElement.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (status === 200) {
        return true;
      }

      if (error.validation) {
        setErrors(apiValidationToErrors(error.validation));
        return false;
      }
      setErrors({ "_global": [error.error || error.message || `Error: ${status}`] });
      return false;
    }
  });
  return <form onSubmit={onFormSubmit} action="/enable-js" method="POST" data-status={status}>
    <code id="debug">[Status: {status}] [Captcha Status: {captchaStatus}]</code>
    <header>
      <h1>Get in touch</h1>
      <p>We'd love to hear from you</p>
    </header>
    <ContactError messages={errors["_global"]} />
    {/* <input type="hidden" name="subject" value="From Contact Form" /> */}
    {inputs.map((props) => (
      <ContactInput key={props.name} {...props} onTouched={onTouchedDeleteError}>
        <ContactError messages={errors[props.name]} />
      </ContactInput>
    ))}
    <div>
      <Turnstile siteKey={import.meta.env.VITE_CONTACT_TURNSTILE_SITEKEY} options={{ size: "flexible" }} onError={() => setCaptchaStatus("ERROR")} onSuccess={() => setCaptchaStatus("SUCCESS")} />
      <ContactError messages={errors["cf-turnstile-response"]} />
    </div>
    <footer>
      <button type="submit" disabled={["LOADING", "SUCCESS"].includes(status)}>
        <SendIcon />
        <span>{status !== "SUCCESS" ? "Send" : "Sent"}</span>
      </button>
    </footer>
  </form>;
}
