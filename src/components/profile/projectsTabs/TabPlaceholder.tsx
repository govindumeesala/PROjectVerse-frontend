// src/components/profile/TabPlaceholder.tsx
import React from "react";
import { Bouncy } from 'ldrs/react';
import 'ldrs/react/Bouncy.css';

export const TabPlaceholder: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl border border-gray-200">
    <Bouncy size="40" speed="1.75" color="#6366f1" />
    <p className="mt-4 text-gray-600 font-medium">Loading content...</p>
    <p className="mt-1 text-gray-400 text-sm">Please wait while we fetch your data</p>
  </div>
);
