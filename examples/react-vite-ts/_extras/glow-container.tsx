import { useResize } from "./use-resize.ts";

export const GlowContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const containerRef = useResize((el) => {
    const { x, y } = el.getBoundingClientRect();
    document.documentElement.style.setProperty("--base-x", x.toFixed(2));
    document.documentElement.style.setProperty("--base-y", y.toFixed(2));
  });
  return <article ref={containerRef} data-glow><div data-glow></div>{children}</article>
}