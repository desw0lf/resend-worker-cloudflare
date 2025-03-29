import { useEffect, useRef } from "react";

export const useResize = (onResize: (ref: HTMLElement) => void, runOnInit = true) => {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        onResize(ref.current);
      }
    };

    if (runOnInit) handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [onResize, runOnInit]);

  return ref;
};