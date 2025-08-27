// src/components/profile/TabPlaceholder.tsx
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const TabPlaceholder: React.FC = () => (
  <div>
    <Skeleton className="h-12 rounded mb-3" />
    <Skeleton className="h-12 rounded mb-3" />
    <Skeleton className="h-12 rounded" />
  </div>
);
