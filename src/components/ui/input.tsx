import { cn } from "@/lib/utils/cn";
import { type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ className, label, error, id, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 font-mono">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-electric-teal focus:border-transparent transition-colors min-h-[44px]",
          error && "border-coral focus:ring-coral",
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-coral">{error}</p>}
    </div>
  );
}
