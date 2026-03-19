import { cn } from "@/lib/utils/cn";
import { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-heading font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none min-h-[44px] min-w-[44px]",
        {
          "bg-deep-teal text-white hover:bg-electric-teal": variant === "primary",
          "border-2 border-deep-teal text-deep-teal hover:bg-deep-teal hover:text-white":
            variant === "secondary",
          "bg-coral text-white hover:bg-red-600": variant === "danger",
          "text-gray-600 hover:text-gray-900 hover:bg-gray-100": variant === "ghost",
        },
        {
          "px-4 py-2 text-sm": size === "sm",
          "px-6 py-3 text-base": size === "md",
          "px-8 py-4 text-lg": size === "lg",
        },
        className
      )}
      {...props}
    />
  );
}
