import Link from "next/link";
import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<typeof Link> & { size?: "md" | "lg" };

const sizes = {
  md: "px-8 py-3.5 text-sm",
  lg: "px-10 py-5 text-base md:text-lg",
};

/** Яркая акцентная кнопка-ссылка (#FFA62B). */
export default function Button({ size = "md", className = "", ...props }: ButtonProps) {
  return (
    <Link
      {...props}
      className={`inline-flex items-center justify-center rounded-sm bg-accent font-accent uppercase tracking-[0.2em] text-navy-deep shadow-[4px_4px_0_0_var(--color-navy)] transition-all hover:-translate-y-0.5 hover:bg-navy hover:text-paper hover:shadow-[6px_6px_0_0_var(--color-accent)] active:translate-y-0 active:shadow-none ${sizes[size]} ${className}`}
    />
  );
}
