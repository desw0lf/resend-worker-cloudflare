import { useRef, useCallback, useEffect } from "react";

export const useFetch = () => {
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  const fetchWithAbort = useCallback(async (url: string, opts: RequestInit = {}) => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;

    try {
      const response = await fetch(url, {
        ...opts,
        signal
      });

      const data = await response.json();

      if (response.status >= 200 && response.status <= 299) {
        return { status: response.status, data };
      }
      return { status: response.status, error: data };
    } catch (error) {
      return { status: -1, error };
    }
  }, []);

  return fetchWithAbort;
};
