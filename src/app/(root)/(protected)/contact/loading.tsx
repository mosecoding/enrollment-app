import { Loader2 } from "lucide-react";
import React from "react";

export default function Loading() {
  return (
    <div className="h-full min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <Loader2 className="animate-spin size-24" />
    </div>
  );
}
