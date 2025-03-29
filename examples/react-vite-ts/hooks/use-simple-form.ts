import { useState } from "react";

type SubmissionStatus = "IDLE" | "LOADING" | "SUCCESS" | "ERROR";
type Values = { [k: string]: string };
export type Errors = { [key: string]: string[] };

interface Props {
  onSuccess: (values: Values, formElement: HTMLFormElement) => Promise<boolean> | boolean;
  validators?: Record<string, (value?: string) => string[]>;
}

export const useSimpleForm = ({ onSuccess, validators = {} }: Props) => {
  const [status, setStatus] = useState<SubmissionStatus>("IDLE");
  const [errors, setErrors] = useState<Errors>({});
  const validateValues = (values: Values): Errors => {
    return Object.entries(validators).reduce((acc, [key, validateFn]) => {
      const list = validateFn(values[key]);
      return {
        ...acc,
        ...(list.length > 0 && { [key]: list })
      }
    }, {} as Errors);
  };
  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setStatus("LOADING");
    const values = Object.fromEntries(new FormData(e.target as HTMLFormElement)) as unknown as Values;
    const errObj = validateValues(values);
    setErrors(errObj);
    if (Object.keys(errObj).length > 0) {
      setStatus("ERROR");
      return;
    }
    const isSuccess = await onSuccess(values, e.target as HTMLFormElement);
    setStatus(isSuccess ? "SUCCESS" : "ERROR");
  }

  const apiValidationToErrors = (validation: { message: string, path: [string] }[] ): Errors => {
    return validation.reduce((acc, { message, path }) => {
      const key = path[0];
      if (!key) return acc;
      const list = acc[key] ? [...acc[key], message] : [message];
      return {
        ...acc,
        [key]: list
      };
    }, {} as Errors);
  }

  const deleteError = (name: string) => {
    setErrors((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [name]: _, ...result } = prev;
      return result;
    });
  }

  const onTouchedDeleteError = (e: { currentTarget: HTMLInputElement | HTMLTextAreaElement }) => deleteError(e.currentTarget.name);

  return { onFormSubmit, setStatus, status, errors, onTouchedDeleteError, apiValidationToErrors, validateValues, setErrors };
}