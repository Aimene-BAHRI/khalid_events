// src/components/dashboard/StatsCard.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

interface Props {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: "orange" | "green" | "blue" | "rose";
  loading?: boolean;
  language?: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  color = "blue",
  loading = false,
}: Props) {
  const colors: Record<string, string> = {
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    rose: "bg-rose-100 text-rose-600",
  };

  return (
    <Card className="shadow-sm rounded-2xl">
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h2 className="text-2xl font-bold mt-1">{loading ? "..." : value}</h2>
        </div>
        <div
          className={cn(
            "w-12 h-12 flex items-center justify-center rounded-xl",
            colors[color]
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
      </CardContent>
    </Card>
  );
}
