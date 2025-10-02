
import { cn } from "@/lib/utils";
import React from "react";

interface DotBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export default function DotBackground({ children, className }: DotBackgroundProps) {
  return (
    <div className={cn("relative w-full bg-white", className)}>
      <div
        className={cn(
          "fixed inset-0 z-0",
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(#a855f7_1px,transparent_1px)]"
        )}
      />
      {/* Enhanced purple radial gradient for the container */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
