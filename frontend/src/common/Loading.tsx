import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  size?: number;
  message?: string;
}

export default function Loading({
  className,
  size = 48,
  message = "Loading...",
}: LoadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-screen bg-white/80 z-50",
        className
      )}
    >
      <Loader2 className="text-gray-600 animate-spin mb-4" size={size} />

      <p className="text-slate-500 text-sm font-medium animate-pulse">
        {message}
      </p>
    </div>
  );
}
