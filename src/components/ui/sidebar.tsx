// src/components/ui/sidebar.tsx
"use client";

import React from "react";

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/80 backdrop-blur-sm border-r border-orange-100/50 transform transition-transform lg:relative lg:translate-x-0 ${className}`}
    >
      {children}
    </div>
  );
};
